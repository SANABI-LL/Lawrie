#!/usr/bin/env bash
# Lawrie 挂件启动器 —— 由 plugin 的 SessionStart hook 调用。
# 逻辑：已在跑就打个招呼（greeting）直接退出；没跑就【后台】确保挂件存在
# （首次自动下载到持久目录）再按平台拉起，起来后补一声 greeting。
# 全程绝不阻塞会话，任何失败都静默退出 0。
set +e

PORT=4747
# 挂件可执行文件的下载地址（GitHub Release 资产，按平台选）
WIN_URL="https://github.com/SANABI-LL/Lawrie/releases/download/v1.0.0/Lawrie-1.0.0-win-x64.exe"
MAC_URL="https://github.com/SANABI-LL/Lawrie/releases/download/v1.1.0/Lawrie-1.1.0-arm64-mac.zip"

# 已经在运行 → 打招呼并退出（幂等，多个会话都能安全调用）
curl -s -m 1 "http://127.0.0.1:${PORT}/greeting" >/dev/null 2>&1 && exit 0

# 持久目录：优先用 plugin 的持久数据目录（跨更新保留），否则退回家目录
DATA="${CLAUDE_PLUGIN_DATA:-$HOME/.claude-lawrie}"

# 后台完成"下载 + 拉起 + 补招呼"，立即返回，不拖慢会话启动
(
  mkdir -p "$DATA" 2>/dev/null
  case "$(uname -s)" in
    Darwin)
      APP="${DATA}/Lawrie.app"
      # 仅当本地还没有挂件时才下载（~90MB，只发生一次）
      if [ ! -d "$APP" ]; then
        ZIP="${DATA}/lawrie-mac.zip"
        curl -sL -m 600 -o "$ZIP" "$MAC_URL" 2>/dev/null
        # 必须用 ditto 解压：unzip 会破坏 .app 内的符号链接和执行位
        [ -s "$ZIP" ] && ditto -xk "$ZIP" "$DATA" 2>/dev/null
        rm -f "$ZIP" 2>/dev/null
      fi
      [ -d "$APP" ] && open -a "$APP" 2>/dev/null
      ;;
    *)
      EXE="${DATA}/Lawrie.exe"
      # 仅当本地还没有挂件时才下载（~70MB，只发生一次）
      if [ ! -s "$EXE" ]; then
        curl -sL -m 600 -o "$EXE" "$WIN_URL" 2>/dev/null
      fi
      if [ -s "$EXE" ]; then
        # 转成 Windows 路径给 explorer.exe（拿干净环境、脱离 hook 进程树，避开 ELECTRON_RUN_AS_NODE）
        winpath="$(cygpath -w "$EXE" 2>/dev/null || echo "$EXE")"
        explorer.exe "$winpath" 2>/dev/null || "$EXE" 2>/dev/null || true
      fi
      ;;
  esac
  # 冷启动补招呼：轮询到挂件端口就位（最多 ~20s），避免"应用还没起来招呼落空"
  for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
    sleep 1
    curl -s -m 1 "http://127.0.0.1:${PORT}/greeting" >/dev/null 2>&1 && break
  done
) >/dev/null 2>&1 &

exit 0
