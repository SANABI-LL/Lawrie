// Lawrie 桌宠 · Electron 主进程
// 透明置顶窗 + 原生拖动 + 拖角缩放 + 本地 HTTP 服务（接收 Claude hook 信号驱动状态）
// 单实例：Claude 每次会话都可尝试拉起，已在运行就不会重复开
const { app, BrowserWindow, screen, ipcMain } = require('electron');
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

function startServer() {
  const server = http.createServer((req, res) => {
    const state = decodeURIComponent((req.url || '/').split('?')[0].replace(/^\/+|\/+$/g, ''));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    if (state && win && !win.isDestroyed()) win.webContents.send('pet-state', state);
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
  app.whenReady().then(() => { createWindow(); startServer(); });
  app.on('window-all-closed', () => app.quit());
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
}
