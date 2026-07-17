# MiBee NVR

[![GitHub Release](https://img.shields.io/github/v/release/Mi-Bee-Studio/MiBeeNvr?style=flat&label=Release)](https://github.com/Mi-Bee-Studio/MiBeeNvr/releases)
[![CI](https://img.shields.io/github/actions/workflow/status/Mi-Bee-Studio/MiBeeNvr/ci.yml?style=flat&label=CI)](https://github.com/Mi-Bee-Studio/MiBeeNvr/actions/workflows/ci.yml)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)](https://go.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=flat&logo=svelte&logoColor=white)](https://svelte.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Raspberry Pi](https://img.shields.io/badge/Raspberry_Pi-A22846?style=flat&logo=raspberrypi&logoColor=white)](https://www.raspberrypi.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

轻量级、易上手的网络视频录像机，单文件部署，零配置烦恼——下载即用。

专为树莓派及低功耗设备打造。支持主流协议：**RTSP**（H.264/H.265/MJPEG）、**HTTP JPEG**、**HLS** 直播流、**ONVIF** 设备发现、**WebRTC**（WHEP）、**HTTP-FLV**、**RTMP** 接入、**SRT** 接收器。

[**English**](README.md)

## 截图

![登录页](docs/images/login-light.png)
![仪表盘](docs/images/dashboard-light.png)
![设置页](docs/images/settings-light.png)

## 核心功能

- **摄像头协议**：RTSP（H.264/H.265/MJPEG）、HTTP JPEG、ONVIF 设备发现与管理、SRT/RTMP 收推（跨网络接入）、原生 Go 转推（把任意摄像头转发到远端，无 FFmpeg）
- **视频录像**：自动 MP4 切片、多摄像头并发、按摄像头设置保留天数、音频录制（AAC + G.711 + Opus）
- **实时直播**：HLS / WebRTC（WHEP）/ HTTP-FLV 多协议直播，RTMP 接入 + SRT 接收器
- **片段合并**：自动/手动合并，全局 + 按摄像头策略
- **Web 界面**：深色/浅色主题、响应式、中英文切换、Chart.js 图表
- **智能家居**：MQTT 触发录像、WebDAV/FTP 文件访问
- **单文件部署**：零依赖、内嵌前端、`CGO_ENABLED=0`
- **小米摄像头**：CS2 P2P 协议、云端认证（社区驱动，非核心功能）
- **健康监控**：多层摄像头健康检测、自动修复、质量评分
- **IP 自愈**：摄像头在多个无线 AP 间漫游导致 IP 变更时，ONVIF 摄像头按序列号自动重新发现并重连（黑名单自动触发 + 手动按钮），单播探测跨子网可用
- **视频转码**：基于 FFmpeg 的硬件转码，H.265→H.264 转换
- **延时摄影**：定时快照延时录像
- **WebSocket 流**：实时二进制帧流
- **AI 检测**：ONNX Runtime 推理，浏览器端目标检测
- **事件系统**：基于 SSE 的实时事件流

## 开发路线

| 状态 | 协议 / 功能 | 说明 |
|------|------------|------|
| ✅ 已完成 | RTSP（H.264/H.265/MJPEG） | 核心流媒体协议 |
| ✅ 已完成 | HTTP JPEG | IP 摄像头快照流 |
| ✅ 已完成 | HLS | 按需直播流 |
| ✅ 已完成 | ONVIF | 设备发现、云台控制、流地址获取 |
| ✅ 已完成 | 小米（CS2 P2P） | 云端认证、H.264/H.265 — 社区支持 |
| ✅ 已完成 | RTMP（接入） | 收推：接收远端推流 |
| ✅ 已完成 | SRT（接入） | 收推：低延迟传输 |
| ✅ 已完成 | RTMP/RTSP（转推） | 转推：原生 Go 中继，转发到远端目标，可选 FFmpeg 兼容模式 |
| ✅ 已完成 | HTTP-FLV | 浏览器友好的直播流 |
| ✅ 已完成 | WebRTC | 亚秒级延迟实时预览 |
| ✅ 已完成 | 音频录制与实时预览 | AAC + G.711 + Opus，按摄像头开关，WebSocket 实时音频播放 |
| ✅ 已完成 | 健康监控 | 多层检测、自动修复 |
## 快速开始

### 方式 1：预编译二进制（推荐）

从 [GitHub Releases](https://github.com/Mi-Bee-Studio/MiBeeNvr/releases) 下载最新二进制文件：

```bash
# AMD64（大多数 PC/服务器）
wget https://github.com/Mi-Bee-Studio/MiBeeNvr/releases/latest/download/mibee-nvr-amd64
chmod +x mibee-nvr-amd64

# ARM64（树莓派等）
wget https://github.com/Mi-Bee-Studio/MiBeeNvr/releases/latest/download/mibee-nvr-arm64
chmod +x mibee-nvr-arm64

# ARMv7（树莓派 2/3 等）
wget https://github.com/Mi-Bee-Studio/MiBeeNvr/releases/latest/download/mibee-nvr-armv7
chmod +x mibee-nvr-armv7
```

初始化配置并启动：

```bash
./mibee-nvr-amd64 init --password yourpassword
./mibee-nvr-amd64 -config mibee-nvr.yaml
```

打开 `http://localhost:9090` 即可访问管理界面。

### 方式 2：Docker

```bash
docker compose --project-directory . -f deploy/docker/docker-compose.yml up -d
```

打开 `http://localhost:9090` 即可访问管理界面。

如需将录像存储到外部硬盘，请修改 `docker-compose.yml` 中的卷挂载：

```yaml
    volumes:
      - /mnt/external/nvr:/data    # ← 改为宿主机路径
    environment:
      - NVR_DATA_DIR=/data          # 必须与卷挂载一致
```

详见 [`deploy/docker/docker-compose.yml`](deploy/docker/docker-compose.yml)。

### 方式 3：一键安装脚本

```bash
curl -fsSL https://raw.githubusercontent.com/Mi-Bee-Studio/MiBeeNvr/main/install.sh | sudo bash
```

自动下载二进制文件、创建系统用户（`nvr`）、生成配置、安装 systemd 服务并启动。数据目录：`/var/lib/mibee-nvr`。

### 方式 4：源码编译

```bash
git clone https://github.com/Mi-Bee-Studio/MiBeeNvr.git
cd MiBeeNvr
make build
./mibee-nvr init --password yourpassword
./mibee-nvr -config mibee-nvr.yaml
```

详细设置请参考 [快速入门](docs/zh/getting-started.md)。

## 文档

| 文档 | 说明 |
|------|------|
| [快速入门](docs/zh/getting-started.md) | 安装、添加第一个摄像头 |
| [配置说明](docs/zh/configuration.md) | 完整配置参考 |
| [API 文档](docs/zh/api/README.md) | REST API 接口文档 |
| [MediaMTX 指南](docs/zh/mediamtx-guide.md) | MediaMTX CSI 摄像头集成 |
| [部署指南](docs/zh/deployment.md) | systemd、反向代理、交叉编译 |
| [摄像头指南](docs/zh/camera-guide.md) | 摄像头设置、协议、故障排除 |
| [Xiaomi 设置](docs/zh/xiaomi-setup.md) | 小米云摄像头集成 |
| [ONVIF 指南](docs/zh/onvif-guide.md) | ONVIF 摄像头设置、云台控制、故障排除 |
| [FTP 集成](docs/zh/ftp-integration.md) | FTP 文件访问设置 |
| [MQTT 集成](docs/zh/mqtt-integration.md) | MQTT 智能家居集成 |
| [WebDAV 集成](docs/zh/webdav-integration.md) | WebDAV 文件访问设置 |
| [故障排除](docs/zh/troubleshooting.md) | 常见问题与解决方案 |
| [视频转码](docs/zh/transcoding.md) | FFmpeg 转码设置 |
| [Prometheus 指标](docs/zh/metrics.md) | 完整的 Prometheus 指标参考，包含类型、标签和使用示例 |

## 开发指南

适合从源码改功能、调前端或跑测试。日常命令以仓库根目录的 `Makefile` 与 `web/package.json` 为准。

### 环境要求

| 工具 | 版本 / 说明 |
|------|-------------|
| Go | 见 [`.go-version`](.go-version)（当前 `1.26`） |
| Node.js + npm | 用于 Svelte 前端（建议 Node 20+） |
| Make | 调用统一构建目标 |
| golangci-lint | 可选；`make lint` 需要，首次执行 `make lint-install` |
| Docker / Podman | 可选；仅构建/运行容器镜像时需要 |
| FFmpeg | 可选；转码相关功能需要，二进制本身可不依赖它 |

```bash
git clone https://github.com/Mi-Bee-Studio/MiBeeNvr.git
cd MiBeeNvr
# 前端依赖（首次或 package.json 变更后）
cd web && npm install && cd ..
```

### 全量构建与本地运行

`make build` 会先构建前端，再把产物拷入 `internal/ui/static/`，最后编译 Go 单二进制。

```bash
# 构建前端 + 后端 → build/mibee-nvr
make build

# 首次初始化配置（生成 mibee-nvr.yaml）
./build/mibee-nvr init --password yourpassword

# 启动服务（默认 Web：http://localhost:9090）
./build/mibee-nvr -config mibee-nvr.yaml

# 仅重新构建前端并同步到内嵌目录（不编 Go）
make frontend

# 清理构建产物
make clean
```

也可直接用仓库根目录下的二进制名（若你把输出链到别处）：

```bash
make build
./mibee-nvr init --password yourpassword   # 若二进制在 PATH 或当前目录
./mibee-nvr -config mibee-nvr.yaml
```

### 前端开发（热更新）

前端 **支持热更新（HMR）**：Vite 改 `.svelte` / CSS / TS 后浏览器自动刷新，无需重启 Go。

改 UI 时建议前后端分开跑：Go 提供 API，Vite 负责热更新。

```bash
# 终端 1：启动后端（需已有可用配置）
make build
./build/mibee-nvr -config mibee-nvr.yaml

# 终端 2：前端开发服务器
cd web
npm install          # 首次
npm run dev          # Vite，默认 http://localhost:5173
```

前端常用脚本：

```bash
cd web

npm run dev          # 开发服务器（HMR）
npm run build        # 生产构建 → web/dist
npm run preview      # 预览生产构建
npm run test         # Vitest 单元测试
npm run check        # svelte-check 类型检查
npm run format       # Prettier 格式化 src/
```

> 说明：发布/嵌入 UI 时请走 `make frontend` 或 `make build`，不要只跑 `npm run build` 就以为二进制里已更新——`make frontend` 会把 `web/dist` 同步到 `internal/ui/static/`。

### 后端开发（无内置热更新）

后端是 **长驻 Go 进程**，本仓库 **没有** 内置类似 Vite 的 HMR：改 `internal/` / `pkg/` / `cmd/` 后需要 **重新编译并重启进程** 才会生效。

原因简要说明：

| | 前端 (Vite) | 后端 (Go NVR) |
|--|-------------|---------------|
| 形态 | 浏览器里的模块图，可热替换 | 已编译的二进制 + 多 goroutine 服务 |
| 改代码后 | HMR / 刷新页面 | 必须重新 `go build` 并重启 |
| 状态 | 页面状态可部分保留 | 重启会断流、断 WebRTC/HLS 会话、停录像循环再拉起 |

日常改后端的两种方式：

**1. 手动重启（最简单、仓库默认）**

```bash
# 改代码后
make build                              # 或：go build -o build/mibee-nvr ./cmd/mibee-nvr
# Ctrl+C 停掉旧进程，再启动
./build/mibee-nvr -config mibee-nvr.yaml
```

只改纯 Go、不动前端时，可跳过 `make frontend`，直接：

```bash
CGO_ENABLED=0 go build -o build/mibee-nvr ./cmd/mibee-nvr
./build/mibee-nvr -config mibee-nvr.yaml
```

**2. 可选：用文件监听自动重编译（社区工具，非项目内置）**

若希望「保存即重启」，可自行安装 [Air](https://github.com/air-verse/air) 等工具，在仓库根目录监听 `.go` 文件：

```bash
# 安装（一次性）
go install github.com/air-verse/air@latest

# 示例：监听并重启（按需写 .air.toml；以下为最小可用命令）
air -c <(cat <<'EOF'
root = "."
tmp_dir = "tmp"
[build]
  cmd = "CGO_ENABLED=0 go build -o ./tmp/mibee-nvr ./cmd/mibee-nvr"
  bin = "./tmp/mibee-nvr"
  full_bin = "./tmp/mibee-nvr -config mibee-nvr.yaml"
  include_ext = ["go"]
  exclude_dir = ["web", "build", "tmp", "docs", "e2e-tests", "node_modules"]
EOF
)
```

注意：

- 自动重启 **仍会中断** 正在进行的直播/录像会话，只是省了你手动敲命令。
- NVR 持有摄像头连接、SQLite、StreamHub 等状态，不适合、也不存在「改一行函数不重启进程」的真正 HMR。
- 配置热加载：改 YAML 是否即时生效取决于具体配置项；多数核心变更仍以重启为准。开发时以重启进程为可靠路径。

### 后端测试与代码检查

```bash
# 全量 Go 测试（含 -race）
make test

# 详细输出
make test-verbose

# 跳过部分慢测
make test-short

# 静态检查
make lint-install    # 首次安装 golangci-lint
make lint
```

只测某个包时可用：

```bash
go test -race ./internal/camera/...
go test -race ./pkg/app/...
```

### 交叉编译与部署

```bash
# ARM64（树莓派 4/5 等）
make cross           # → build/mibee-nvr-arm64

# ARMv7（树莓派 2/3 等）
make cross-armv7     # → build/mibee-nvr-armv7

# 部署到树莓派（需改 Makefile 中的 RPi_HOST）
make deploy          # 交叉编译 + scp + 重启服务
make deploy-check    # 检查远端服务是否 active
make rollback        # 回滚到远端 .bak 备份
```

### 常用命令速查

| 命令 | 作用 |
|------|------|
| `make build` | 前端 + 本机架构 Go 二进制 |
| `make frontend` | 仅构建并嵌入前端 |
| `make test` | Go 测试（`-race`） |
| `make lint` | golangci-lint |
| `make cross` | Linux ARM64 交叉编译 |
| `make cross-armv7` | Linux ARMv7 交叉编译 |
| `make clean` | 清理 `build/`、`web/dist` 等 |
| `make docker-build` | 构建当前架构容器镜像 |
| `make docker-build-arm64` | 构建 arm64 镜像（容器内交叉编译） |
| `make docker-build-all` | 构建多架构镜像 |
| `cd web && npm run dev` | 前端热更新开发 |
| `cd web && npm run test` | 前端单元测试 |

### 推荐工作流

1. 从 `dev`（或 `main`）拉分支：`git checkout -b feat/xxx`
2. 改代码：后端在 `internal/` / `pkg/` / `cmd/`；前端在 `web/src/`
3. 本地验证：`make test`、`cd web && npm run test`，必要时 `make lint`
4. 全量确认：`make build` 后用二进制起服务点一遍关键路径
5. 提交前再跑一遍测试；本仓库 fork 工作流见下方 [Fork 开发工作流](#fork-开发工作流)

配置项说明见 [配置说明](docs/zh/configuration.md)；部署与 systemd 见 [部署指南](docs/zh/deployment.md)。

## Docker 容器镜像

快速部署请参考 [`deploy/docker/docker-compose.yml`](deploy/docker/docker-compose.yml)：

```bash
docker compose --project-directory . -f deploy/docker/docker-compose.yml up -d
```

使用位于 `deploy/docker/Dockerfile` 的单一多架构构建文件：在容器内交叉编译前端与后端，并复用预构建的多架构基础镜像（含 FFmpeg），全程无需 QEMU 模拟。

```bash
# 构建 amd64 镜像
make docker-build

# 构建 arm64 镜像（容器内交叉编译，无需 QEMU）
make docker-build-arm64

# 构建全部架构
make docker-build-all

# 推送到镜像仓库（需先 docker/podman login）
make docker-push              # 推送 amd64
make docker-push-arm64        # 推送 arm64
make docker-push-all          # 推送全部

# 一键构建并推送
make docker-release
```

镜像在打版本标签时自动发布到 GitHub Container Registry：

| 镜像 | 架构 |
|------|------|
| `ghcr.io/mi-bee-studio/mibeenvr:<tag>` | amd64, arm64, armv7 |

可用标签：`latest`、`v1.2.3`（semver）、`sha-abc1234`

## 项目结构

```
cmd/mibee-nvr/       # 程序入口
internal/            # 核心模块（29 个）
  ai/               # AI 配置 + ROI 区域存储（推理在浏览器端，见 web/src/lib/ai-detection/）
  api/              # REST API
  camera/           # 摄像头管理
  cleanup/          # 保留策略 + 磁盘清理
  config/           # YAML 配置、验证
  event/            # 发布/订阅事件总线
  flv/              # HTTP-FLV 直播
  ftp/              # FTP 服务
  health/           # 摄像头健康监控
  hls/              # HLS 直播（+ LL-HLS）
  merge/            # 片段合并
  metrics/          # Prometheus 指标
  middleware/       # 认证、限流
  model/            # 核心类型
  mqtt/             # MQTT 客户端
  muxer/            # MP4 封装器
  onvif/            # ONVIF 发现、云台控制
  recorder/         # H.264/H.265/MJPEG/JPEG/ONVIF/小米/延时录像引擎
  rtmp/             # RTMP 接入服务
  srt/              # SRT 监听器
  storage/          # SQLite 数据库 + 文件管理
  timelapse/        # 延时录像管理器
  transcoding/      # FFmpeg 转码
  ui/               # 内嵌 Web UI
  upload/           # HTTP 上传处理
  webdav/           # WebDAV 服务
  webrtc/           # WebRTC WHEP 直播
  wsstream/         # WebSocket 直播流
  xiaomi/           # 小米摄像头（CS2 P2P）
web/                 # Svelte 5 前端
deploy/              # systemd 服务文件
docs/                # 文档（中文/英文）
```

## Fork 开发工作流

本仓库 fork 自 [Mi-Bee-Studio/MiBeeNvr](https://github.com/Mi-Bee-Studio/MiBeeNvr)，以下为自己维护 fork 的 Git 工作流。

### 分支角色

| 分支 | 用途 | 操作 |
|------|------|------|
| `main` | 上游镜像，不同步不提交 | 只执行 `git fetch upstream && git rebase upstream/main` |
| `dev` | 自己的代码基地，部署用 | 所有 feature 合入这里 |
| `feat/*` / `fix/*` | 单个功能或修复 | 从 `dev` 切，完成后 `--ff-only` 合回 `dev` |

### 同步上游

```bash
git checkout main
git fetch upstream
git rebase upstream/main
git push origin main

git checkout dev
git rebase main
git push origin dev --force-with-lease
```

### 开发新功能

```bash
# 从 dev 开分支
git checkout -b feat/xxx dev

# 写代码、commit
git add . && git commit -m "feat: 描述"
git push origin feat/xxx

# 完成后合入 dev
git checkout dev
git merge feat/xxx --ff-only
git push origin dev
```

### 远程仓库设置

```bash
# upstream = 原作者仓库（只读）
git remote add upstream https://github.com/Mi-Bee-Studio/MiBeeNvr.git

# origin = 自己的 fork
git remote add origin https://github.com/Nico-M/MiBeeNvr.git
```

[MIT License](LICENSE) © Mi&Bee Studio
