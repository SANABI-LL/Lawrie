// 一次性工具：把任意 rabbit-*.svg.html 状态离屏渲染成透明 PNG。
// 用途：① 1024px 出图做 .icns 应用图标；② 387px 出 previews/*.png 预览图。
// 用法：npx electron tools/capture.js <状态文件路径> <输出.png> [尺寸=1024] [缩放=1] [noshadow]
// 缩放 <1 时角色居中留白（做 .icns 用 0.82 左右）；noshadow 隐藏地面阴影。
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const [,, srcArg, outArg, sizeArg, scaleArg, shadowArg, waitArg] = process.argv;
if (!srcArg || !outArg) { console.error('用法: npx electron tools/capture.js <svg.html> <out.png> [size] [scale] [noshadow]'); app.exit(1); }
const SIZE = parseInt(sizeArg || '1024', 10);
const SCALE = parseFloat(scaleArg || '1');
const NOSHADOW = shadowArg === 'noshadow';
const PET = Math.round(SIZE * SCALE);
const src = path.resolve(srcArg);
const out = path.resolve(outArg);

app.dock && app.dock.hide();
app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: SIZE, height: SIZE, show: false, frame: false, transparent: true,
    webPreferences: { offscreen: true }
  });
  // 与 pet.html 同款注入：去掉演示页深色背景，按目标尺寸渲染像素画
  const html = fs.readFileSync(src, 'utf-8').replace(
    '</head>',
    `<style>html,body{background:transparent!important}:root{--pixel-size:${PET}px!important}#stage{width:${PET}px!important;height:${PET}px!important}${NOSHADOW ? '#shadow{display:none!important}' : ''}</style></head>`
  );
  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
  await new Promise(r => setTimeout(r, parseInt(waitArg || '600', 10)));   // 等目标帧就位（第 6 参可指定 ms）
  const img = await win.webContents.capturePage();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, img.toPNG());
  console.log(`已输出 ${out}（${SIZE}x${SIZE}）`);
  app.exit(0);
});
