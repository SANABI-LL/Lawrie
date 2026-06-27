// Lawrie 桌宠 · Electron 主进程
// 透明置顶窗 + 原生拖动 + 拖角缩放 + 本地 HTTP 服务（接收 Claude hook 信号驱动状态）
// 单实例：Claude 每次会话都可尝试拉起，已在运行就不会重复开
const { app, BrowserWindow, screen, ipcMain, powerMonitor } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

const MIN = 140, MAX = 640, DEFAULT = 220;
const PORT = 4747;
function configPath() { return path.join(app.getPath('userData'), 'config.json'); }
function readSize() { try { return Math.max(MIN, Math.min(MAX, JSON.parse(fs.readFileSync(configPath(), 'utf-8')).size || DEFAULT)); } catch (e) { return DEFAULT; } }
function writeSize(s) { try { fs.writeFileSync(configPath(), JSON.stringify({ size: s }, null, 2)); } catch (e) {} }

let win;
let currentSize = DEFAULT;

function createWindow() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
  currentSize = readSize();
  const S = currentSize;
  win = new BrowserWindow({
    width: S, height: S, x: sw - S - 24, y: sh - S - 24,
    transparent: true, frame: false, alwaysOnTop: true,
    resizable: false, hasShadow: false, skipTaskbar: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false, webSecurity: false }
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.loadFile('pet.html');
}

// notification 状态：一直停留，直到检测到用户动了鼠标/键盘（全局），才转 idle
let notifWatch = null;
function clearNotifWatch() { if (notifWatch) { clearInterval(notifWatch); notifWatch = null; } }
function watchForUser() {
  clearNotifWatch();
  const start = Date.now();
  notifWatch = setInterval(() => {
    // getSystemIdleTime() = 距上次全局输入的秒数；换算出"上次输入时刻"
    const lastInput = Date.now() - powerMonitor.getSystemIdleTime() * 1000;
    if (lastInput > start + 800) {   // 通知出现 800ms 后又有新输入 = 用户回来了
      clearNotifWatch();
      if (win && !win.isDestroyed()) win.webContents.send('pet-state', 'idle');
    }
  }, 400);
}

// 2 分钟内没有任何 Claude 活动（没有新状态进来）→ 自动睡觉
let sleepTimer = null;
const SLEEP_MS = 120000;
function armSleep() { clearTimeout(sleepTimer); sleepTimer = setTimeout(() => pushState('sleeping'), SLEEP_MS); }

function pushState(state) {
  if (!state || !win || win.isDestroyed()) return;
  win.webContents.send('pet-state', state);
  if (state === 'notification') watchForUser();   // 进通知 → 开始等用户回来
  else clearNotifWatch();                          // 任何别的状态 → 取消等待
  if (state === 'sleeping') clearTimeout(sleepTimer); // 已睡，停止计时
  else armSleep();                                    // 其它状态：重新计 2 分钟
}

// 光标是否在窗口内 → 让渲染层显隐缩放手柄（绕开 app-region:drag 抓不到 hover）
// 同时算光标相对窗口中心的方向，驱动 idle 的眼球跟随（±1 像素一瞥）
let lastInside = null;
let lastAimX = null, lastAimY = null;
function startCursorWatch() {
  setInterval(() => {
    if (!win || win.isDestroyed()) return;
    const p = screen.getCursorScreenPoint();
    const b = win.getBounds();
    const inside = p.x >= b.x && p.x < b.x + b.width && p.y >= b.y && p.y < b.y + b.height;
    if (inside !== lastInside) { lastInside = inside; win.webContents.send('cursor-in', inside); }

    // 眼球跟随：光标在窗口中心哪个方向 → 带死区吸附到 -1/0/1，只在变化时下发
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    const dead = b.width * 0.12;     // 靠近中心的死区，避免眼睛抖动；想更明显就调小
    const ax = Math.abs(p.x - cx) < dead ? 0 : (p.x > cx ? 1 : -1);
    const ay = Math.abs(p.y - cy) < dead ? 0 : (p.y > cy ? 1 : -1);
    if (ax !== lastAimX || ay !== lastAimY) { lastAimX = ax; lastAimY = ay; win.webContents.send('cursor-aim', { ax, ay }); }
  }, 150);
}

function startServer() {
  const server = http.createServer((req, res) => {
    const state = decodeURIComponent((req.url || '/').split('?')[0].replace(/^\/+|\/+$/g, ''));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    pushState(state);
  });
  server.on('error', (err) => { console.error('[lawrie] HTTP 服务出错：', err.message); });
  server.listen(PORT, '127.0.0.1', () => console.log('[lawrie] 监听 http://127.0.0.1:' + PORT));
}

ipcMain.on('get-size', (e) => { e.returnValue = currentSize; });

const clamp = (s) => Math.max(MIN, Math.min(MAX, Math.round(s)));
function setBox(x, y, s) {
  currentSize = s;
  win.setBounds({ x: Math.round(x), y: Math.round(y), width: s, height: s });
  writeSize(s);
  win.webContents.send('size-changed', s);
}

ipcMain.on('set-size', (e, s) => {
  s = clamp(s);
  const b = win.getBounds();
  setBox(b.x + b.width / 2 - s / 2, b.y + b.height / 2 - s / 2, s);
});

let rs = null;
ipcMain.on('resize-start', (e, corner) => { const b = win.getBounds(); rs = { corner, left: b.x, top: b.y, right: b.x + b.width, bottom: b.y + b.height }; });
ipcMain.on('resize-move', (e, p) => {
  if (!rs) return;
  if (rs.corner === 'se') { const s = clamp(Math.max(p.x - rs.left, p.y - rs.top)); setBox(rs.left, rs.top, s); }
  else { const s = clamp(Math.max(rs.right - p.x, rs.bottom - p.y)); setBox(rs.right - s, rs.bottom - s, s); }
});
ipcMain.on('resize-end', () => { rs = null; });

// ── 单实例守卫：第二次启动直接退出，已有的那只浮到前面 ──
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { win.show(); win.focus(); } });
  app.whenReady().then(() => { createWindow(); startServer(); startCursorWatch(); armSleep(); });
  app.on('window-all-closed', () => app.quit());
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
}
