# Lawrie · 像素萝卜兔桌宠 🐰🥕

一只用 [pet-forge](https://github.com/) SVG 路线做的**自定义像素风桌宠** —— 一只爱萝卜的兔子。每个状态都是一个**自包含的 `.svg.html`**（内联 SVG + CSS + JS，零依赖，双击即跑），整像素、硬边、跳帧的像素风。

> 这个仓库是制作进度的存档，随时可以回来看做到哪了。

## 在线预览

开了 GitHub Pages 后，直接打开总览页一眼看全部状态的动效：
**https://sanabi-ll.github.io/Lawrie/**

或者把任意 `rabbit-*.svg.html` 下载下来双击用浏览器打开。

## 角色设定

- **形态**：站立全身像素兔（长立耳 + 粉内耳 + 圆身 + 短腿）
- **配色 DNA**：暖白毛 `#F5EFE4` / 深可可描边 `#5A4A3F` / 粉内耳 `#F4A7B6` / 深可可眼
- **motif**：**爱萝卜** —— 每个状态都藏着萝卜（兜里揣着 / 掏出来吃 / 梦里想 / 思考问号都是萝卜形）
- **画布**：28×28 像素，`image-rendering: pixelated` 放大显示

## 状态进度

| 状态 | 文件 | 表现 | 状态 |
|---|---|---|---|
| idle | `rabbit-idle.svg.html` | 呼吸 + 眨眼 + 偶尔掏萝卜吃 | ✅ |
| typing | `rabbit-typing.svg.html` | 笔记本背面 + 眼球扫 + "da" 飘 + 侧边啃萝卜 | ✅ |
| thinking | `rabbit-thinking-v2.svg.html` | 眼上瞟 + "..." + 灵光一现灯泡亮 | ✅ |
| sleeping | `rabbit-sleeping.svg.html` | 趴睡 + 舔嘴 + 萝卜梦境泡泡 | ✅ |
| happy | `rabbit-happy.svg.html` | 蹦跳欢呼 + 举手 + 星星 | ✅ |
| error | `rabbit-error-v2.svg.html` | XX 晕眼 + 金星绕头 + glitch 错位 | ✅ |
| notification | `rabbit-notification.svg.html` | 盯人 + 两侧 ping 声波 + 闪烁大"!" + 兜里露橙头 | ✅ |
| carrying | `rabbit-carrying.svg.html` | 团队大哥：戴墨镜 + 左拳冲天 + 右举长萝卜剑 + 嘚瑟晃动 + 墨镜扫光 | ✅ |

**8 件套全部完成** 🎉：最小可上线集 (idle/typing/thinking/sleeping/happy) + error + notification + carrying。

> carrying 的语义最后定为「扛起重任的团队大哥」——胡萝卜是它披荆斩棘的武器，戴着墨镜嘚瑟亮相。

## 项目阶段

- [x] ①角色设计（拓扑 + 像素风格 + 萝卜 motif）
- [x] ②做状态动画（8/8 建议状态全部完成）
- [ ] ③接桌宠运行时（theme.json 映射 agent 事件 → 状态切换）
- [ ] ④部署成真正会动的桌面挂件

## 制作说明

- 造型用一张 28×28 的 ASCII `SPRITE` 字符图谱，JS 读图谱渲染成 1×1 `<rect>`（`.`透明 `O`描边 `W`毛 `P`粉 `B`肚皮）。改图谱即改造型。
- 角色一致性靠跨状态复用同一套图谱。
- `_archive/` 里是早期/被替换的版本（柴犬试做、thinking/error 的 v1）留作追溯。

---

用 [Claude Code](https://claude.com/claude-code) + pet-forge skill 制作。
