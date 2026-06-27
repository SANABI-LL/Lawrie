// 把 8 个状态文件从 my-pet/ 同步进 widget/assets/，让挂件自包含（可打包）
// 改了状态文件后，重新跑一次：node sync-assets.js
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..');        // my-pet/
const DST = path.join(__dirname, 'assets');
const theme = require('./theme.json');

fs.mkdirSync(DST, { recursive: true });
let n = 0;
for (const file of Object.values(theme.states)) {
  const from = path.join(SRC, file);
  if (fs.existsSync(from)) { fs.copyFileSync(from, path.join(DST, file)); n++; console.log('  ✓', file); }
  else console.warn('  ✗ 找不到', from);
}
console.log('同步完成：' + n + ' 个状态文件 → assets/');
