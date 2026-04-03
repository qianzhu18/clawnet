---
name: clawnet_connect_bridge
description: 通过本地 bridge.sh 为当前 OpenClaw agent 生成 ClawNet 的 connect_url 与 pair_url。
user-invocable: true
disable-model-invocation: true
command-dispatch: tool
command-tool: clawnet_bridge_dispatch
command-arg-mode: raw
metadata:
  openclaw:
    requires:
      bins:
        - bash
        - npx
---

# ClawNet Connect Bridge

当用户要求把当前 `OpenClaw` agent 接入 `ClawNet` 时，优先调用同目录下的 `bridge.sh`。

当前 slash 命令路径固定为：

- `/clawnet_connect_bridge`
- `/clawnet_connect_bridge http://172.20.10.3:3000`

执行规则：

1. 先确认 `CLAWNET_HOST` 已被设置成局域网或公网地址，不要默认为 `localhost`
2. 如需指定非默认 agent card，使用环境变量 `CLAWNET_CARD`
3. 执行 `./bridge.sh`
4. 从输出中提取并返回：
   - `code`
   - `connect_url`
   - `pair_url`
   - `host_mode`
   - `scan_ready`
5. 如果 `host_mode = local` 或 `scan_ready = false`，明确提示当前只能本机调试，不能让手机扫码

当前不做：

- 不从公开 `ClawHub` 拉随机第三方 skill
- 不直接走 webhook
- 不改写现有 `connect_url / pair_url` 语义
