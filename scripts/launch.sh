#!/usr/bin/env bash
# Lawrie 挂件启动器 —— 由 plugin 的 SessionStart hook 调用。
# 逻辑：已在跑就设 idle 直接退出；没跑就【后台】确保 exe 存在（首次自动下载到持久目录）
# 再用文件管理器干净环境拉起。全程绝不阻塞会话，任何失败都静默退出 0。
set +e

PORT=4747
# 挂件可执行文件的下载地址（GitHub Release 资产）
URL="https://github.com/SANABI-LL/Lawrie/releases/download/v1.0.0/Lawrie-1.0.0-win-x64.exe"

# 已经在运行 → 设为 idle 并退出（幂等，多个会话都能安全调用）
curl -s -m 1 "http://127.0.0.1:${PORT}/idle" >/dev/null 2>&1 && exit 0

# 持久目录：优先用 plugin 的持久数据目录（跨更新保留），否则退回家目录
DATA="${CLAUDE_PLUGIN_DATA:-$HOME/.claude-lawrie}"
EXE="${DATA}/Lawrie.exe"

# 后台完成"下载 + 拉起"，立即返回，不拖慢会话启动
(
  mkdir -p "$DATA" 2>/dev/null
  # 仅当本地还没有挂件时才下载（~70MB，只发生一次）
  if [ ! -s "$EXE" ]; then
    curl -sL -m 600 -o "$EXE" "$URL" 2>/dev/null
  fi
  if [ -s "$EXE" ]; then
    # 转成 Windows 路径给 explorer.exe（拿干净环境、脱离 hook 进程树，避开 ELECTRON_RUN_AS_NODE）
    winpath="$(cygpath -w "$EXE" 2>/dev/null || echo "$EXE")"
    explorer.exe "$winpath" 2>/dev/null || "$EXE" 2>/dev/null || true
  fi
) >/dev/null 2>&1 &

exit 0
