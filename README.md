# Lawrie · 像素萝卜兔桌宠 🐰🥕

[![Latest release](https://img.shields.io/github/v/release/SANABI-LL/Lawrie?label=release&color=F0913C)](https://github.com/SANABI-LL/Lawrie/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/SANABI-LL/Lawrie/total?label=downloads&color=7FBF4F)](https://github.com/SANABI-LL/Lawrie/releases)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-0078D6)](#怎么跑)

一只用 [pet-forge](https://github.com/SANABI-LL/pet-forge-2) SVG 路线做的**自定义像素风桌宠** —— 一只爱萝卜的兔子。每个状态都是一个**自包含的 `.svg.html`**（内联 SVG + CSS + JS，零依赖，双击即跑），整像素、硬边、跳帧的像素风。

> 这个仓库是制作进度的存档，随时可以回来看做到哪了。

**⬇️ 直接用**：到 [Releases](https://github.com/SANABI-LL/Lawrie/releases/latest) 下载 `Lawrie-*-win-x64.exe`，双击即跑（Windows）。

## 状态一览

<table>
  <tr>
    <td align="center"><img src="previews/idle.png" width="104" alt="idle"><br><sub>idle</sub></td>
    <td align="center"><img src="previews/typing.png" width="104" alt="typing"><br><sub>typing</sub></td>
    <td align="center"><img src="previews/thinking.png" width="104" alt="thinking"><br><sub>thinking</sub></td>
    <td align="center"><img src="previews/sleeping.png" width="104" alt="sleeping"><br><sub>sleeping</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="previews/happy.png" width="104" alt="happy"><br><sub>happy</sub></td>
    <td align="center"><img src="previews/error.png" width="104" alt="error"><br><sub>error</sub></td>
    <td align="center"><img src="previews/notification.png" width="104" alt="notification"><br><sub>notification</sub></td>
    <td align="center"><img src="previews/carrying.png" width="104" alt="carrying"><br><sub>carrying</sub></td>
  </tr>
</table>

<sub>静态预览（`previews/`）。想看动效：开 GitHub Pages 后进总览页，或双击任意 `rabbit-*.svg.html`。</sub>

## 一键接入 Claude Code

在 Claude Code 里输入这两行：

```
/plugin marketplace add SANABI-LL/Lawrie
/plugin install lawrie-pet@lawrie
```

装好后**重开 Claude Code**，兔子就自动出现、跟着你干活换状态了 —— 全程不用碰任何配置文件。

- 首次会自动下载挂件（约 70MB，一次性），下载完兔子就蹦出来。
- 不想要了：`/plugin uninstall lawrie-pet@lawrie`，hooks 一起干净移除。
- 目前挂件是 **Windows** 的；macOS / Linux 见下方「手动接入 / 其他平台」。

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
- [x] ③接桌宠运行时（`runtime/widget/` 自做 Electron 挂件 + `theme.json` 状态清单 + 本地 4747 接 Claude 事件）
- [x] ④部署成真正会动的桌面挂件（打包成可执行文件、随 Claude Code 会话自启、对真实工具事件实时换状态）

## 运行时 / 桌面挂件

`runtime/widget/` 是一个自做的极简 Electron 挂件（透明置顶、原生拖动、拖角缩放、大小记忆），把上面 8 个 `.svg.html` 状态接成一只**会跟着 Claude Code 实时变状态**的桌宠。

**怎么跑**：

```bash
cd runtime/widget
npm install
npm start          # 同步状态资源并启动挂件（开发用）
# 或 npm run dist   # 打包成桌面可执行文件
```

> **平台说明**：预打包的 exe 和上面的 hook 拉起命令（`explorer.exe`）是 **Windows** 的。
> **macOS / Linux** 用户可以从源码跑：`npm start` 直接看挂件（Electron 跨平台）；要接 Claude Code，把 `hooks.example.json` 里 `SessionStart` 的拉起命令换成你系统的等价物——macOS 用 `open -a "/路径/Lawrie.app" || exit 0`，Linux 直接写可执行文件路径 `/路径/lawrie &`（其余 `curl` 那几行跨平台通用，不用改）。打包到 mac/linux 需在 `runtime/widget/package.json` 的 `build.win` 旁加 `mac` / `linux` target 再 `npm run dist`。

**实时联动原理**：挂件在 `127.0.0.1:4747` 起一个本地 HTTP 服务，`GET /<状态名>` 就把兔子切到对应状态。再通过 Claude Code 的 [hooks](https://docs.claude.com/en/docs/claude-code/hooks) 把生命周期事件映射成对这个端口的请求，于是 Claude 一边干活，兔子一边自己换表情：

| Claude Code 事件 | 兔子状态 |
|---|---|
| SessionStart | idle（顺带没开就拉起挂件） |
| UserPromptSubmit | thinking |
| Pre/PostToolUse | typing |
| PostToolUseFailure | error |
| SubagentStart / Stop | carrying / typing |
| Notification、Stop（答完） | notification |

<details>
<summary><b>手动接入 / 其他平台</b>（不用 plugin 时展开 · 非码农也能做）</summary>

> 大多数人用上面的「一键接入」就够了。这里是不想装 plugin、或 macOS/Linux 用户的手动方案。

hook 配置模板在 [`runtime/widget/hooks.example.json`](runtime/widget/hooks.example.json)。下面是把它接通的完整步骤（Windows）：

**第 1 步：把兔子放到一个固定文件夹**

- 从 [Releases](https://github.com/SANABI-LL/Lawrie/releases) 下载 `Lawrie-1.0.0-win-x64.exe`（或自己 `npm run dist` 打包出来的 exe）。
- 在 `C:\Users\你的用户名\` 下新建一个文件夹叫 `Lawrie`，把 exe 拖进去，并**改名成 `Lawrie.exe`**（去掉版本号，方便后面写路径）。
- 别放在"下载"文件夹里——那里的东西容易被清掉。

> 不知道"你的用户名"是什么？打开文件资源管理器，在地址栏输入 `%USERPROFILE%` 回车，跳到的那个文件夹名字就是。

**第 2 步：找到 Claude Code 的设置文件**

- 打开文件资源管理器，地址栏输入 `%USERPROFILE%\.claude` 回车。
- 看有没有 `settings.json`：有就用记事本打开它；没有就在这个文件夹里新建一个文本文件，改名成 `settings.json`（注意结尾是 `.json` 不是 `.txt`）。

**第 3 步：把下面这段粘进 `settings.json`**

如果你的 `settings.json` 原本是空的，直接把下面整段粘进去，然后**只改一处**：把两处 `你的用户名` 换成你真实的用户名。

```json
{
  "hooks": {
    "SessionStart":       [{ "matcher": "", "hooks": [{ "type": "command", "command": "curl -s -m 1 http://127.0.0.1:4747/idle || explorer.exe \"C:\\Users\\你的用户名\\Lawrie\\Lawrie.exe\" || exit 0" }] }],
    "UserPromptSubmit":   [{ "matcher": "", "hooks": [{ "type": "command", "command": "curl -s -m 2 http://127.0.0.1:4747/thinking || exit 0" }] }],
    "PreToolUse":         [{ "matcher": "", "hooks": [{ "type": "command", "command": "curl -s -m 2 http://127.0.0.1:4747/typing || exit 0" }] }],
    "PostToolUse":        [{ "matcher": "", "hooks": [{ "type": "command", "command": "curl -s -m 2 http://127.0.0.1:4747/typing || exit 0" }] }],
    "PostToolUseFailure": [{ "matcher": "", "hooks": [{ "type": "command", "command": "curl -s -m 2 http://127.0.0.1:4747/error || exit 0" }] }],
    "Notification":       [{ "matcher": "", "hooks": [{ "type": "command", "command": "curl -s -m 2 http://127.0.0.1:4747/notification || exit 0" }] }],
    "SubagentStart":      [{ "matcher": "", "hooks": [{ "type": "command", "command": "curl -s -m 2 http://127.0.0.1:4747/carrying || exit 0" }] }],
    "SubagentStop":       [{ "matcher": "", "hooks": [{ "type": "command", "command": "curl -s -m 2 http://127.0.0.1:4747/typing || exit 0" }] }],
    "Stop":               [{ "matcher": "", "hooks": [{ "type": "command", "command": "curl -s -m 2 http://127.0.0.1:4747/notification || exit 0" }] }]
  }
}
```

> ⚠️ **两个最容易踩的坑**：
> 1. **路径里的反斜杠要写两条**。JSON 里 `\` 是特殊符号，所以路径必须是 `C:\\Users\\你的用户名\\Lawrie\\Lawrie.exe`（双反斜杠），照抄上面的格式即可。
> 2. **如果 `settings.json` 里原本已经有内容**（比如已有 `"model"`、`"theme"` 之类），不要整段覆盖——只把 `"hooks": { ... }` 这一块，加进最外层那对大括号 `{ }` 里面，并用逗号和已有内容隔开。拿不准就把原文件备份一份再改。

**第 4 步：重启 Claude Code**

存盘后，**关掉 Claude Code 再重开**（hook 只在新会话生效）。新会话一开始，兔子就会自己蹦出来（SessionStart 会拉起它），然后跟着你干活实时换表情。

**第 5 步：验证**

- 发一句消息 → 兔子进入 thinking（眼睛上瞟）。
- 让它跑个工具/改文件 → 切到 typing（啃萝卜打字）。
- 出错 → error 晕眼。都对上就接通了。

> 想先单独看看兔子？直接双击 `Lawrie.exe` 就能在桌面看到它（拖动移动、拖角缩放、`Ctrl+Q` 退出）。`idle` 时它的眼睛还会跟着鼠标瞟（±1 像素）。

**接不通时怎么查**：

- 兔子没出现 → 先手动双击 `Lawrie.exe` 确认它自己能开；能开就说明是第 1 步的路径没填对。
- 兔子开着但不换表情 → 多半是 `settings.json` 格式错了（少了逗号/括号）。把内容贴到任意"JSON 校验"网站检查一下。
- 状态乱跳 → 确认端口 4747 没被别的程序占用。

</details>

## 制作说明

- 造型用一张 28×28 的 ASCII `SPRITE` 字符图谱，JS 读图谱渲染成 1×1 `<rect>`（`.`透明 `O`描边 `W`毛 `P`粉 `B`肚皮）。改图谱即改造型。
- 角色一致性靠跨状态复用同一套图谱。
- `_archive/` 里是早期/被替换的版本（柴犬试做、thinking/error 的 v1）留作追溯。

## License

双轨授权:

- **代码**(`runtime/widget/` 挂件、脚本、`.svg.html` 技术结构、配置)—— [MIT](LICENSE)。随便学、随便改去做你自己的桌宠。
- **Lawrie 角色形象**(像素造型、配色、萝卜 motif、`rabbit-*.svg.html` 的视觉设计)—— © 2026 SANABI-LL,**保留版权**,详见 [ART-LICENSE.md](ART-LICENSE.md)。可运行、可学技法,但请不要照搬这只兔子去再发布。

想做自己的桌宠?用[方法](https://github.com/SANABI-LL/pet-forge-2)而不是这只兔子——做一只有你自己视觉 DNA 的角色,这正是 pet-forge 的初衷。

---

用 [Claude Code](https://claude.com/claude-code) + pet-forge skill 制作。
