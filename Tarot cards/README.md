# 塔罗牌占卜系统 (Tarot Card Reading System)

这是一个基于 React (前端) 和 Node.js (后端) 开发的完整塔罗牌占卜 Web 应用。系统包含了 78 张标准塔罗牌的完整数据（大阿卡那 + 小阿卡那），并支持多种经典牌阵的占卜、牌意解读以及占卜历史记录保存。

## 项目结构

本项目采用了 Monorepo 的结构设计，分为前端（Client）和后端（Server）两部分：

- `/client`: React 前端应用，负责 UI 展示、交互动画和路由。
- `/server`: Node.js 后端服务，负责处理 API 请求和操作 SQLite 数据库。
- `/data`: SQLite 数据库存储目录（自动生成）。
- `/docs`: 项目 API 文档和用户手册。

## 环境要求

- Node.js (建议 v16 或更高版本)
- npm (建议 v8 或更高版本)

---

## 🚀 如何运行项目

### 1. 安装依赖

在项目根目录下打开终端，运行以下命令。该命令会自动安装根目录、前端和后端的全部依赖包：

```bash
npm run install:all
```

> **注意**：如果安装速度较慢，建议配置 npm 淘宝镜像源：`npm config set registry https://registry.npmmirror.com`

### 2. 初始化数据库 (可选，仅首次运行或重置时需要)

后端使用 `sql.js` 模拟 SQLite 数据库进行存储。如果您想重置数据库或确保数据文件存在，可以进入 `server` 目录手动执行初始化：

```bash
cd server
node src/database/init.js
cd ..
```
*正常情况下，第一次启动服务时，如果检测到没有数据文件，系统也会尝试自动创建并初始化。*

### 3. 启动开发服务器

在项目根目录下运行以下命令，即可**同时**启动前端 React 开发服务器和后端 Node.js 接口服务：

```bash
npm run dev
```

启动成功后：
- 前端页面会自动在浏览器中打开：`http://localhost:3000`
- 后端 API 服务将运行在：`http://localhost:3001`

---

## 📦 如何打包和部署 (生产环境)

如果您想将该项目打包成可以部署在生产服务器上的版本，可以使用提供的打包脚本。

在项目根目录运行：

```bash
npm run package
```

**打包流程说明**：
1. 脚本会首先运行前端的 `npm run build`，将 React 项目编译为静态文件。
2. 在根目录创建一个名为 `tarot-app-release` 的文件夹。
3. 将后端的源码和前端的编译产物整合放入该文件夹。
4. 生成可以直接双击运行的启动脚本（`start.bat` / `start.sh`）和 `package.json`。

**部署该产物**：
1. 将 `tarot-app-release` 文件夹复制到您的服务器。
2. 在该文件夹内执行 `npm run install:prod` 安装生产环境依赖。
3. 执行 `./start.bat` (Windows) 或 `./start.sh` (Mac/Linux) 即可一键启动服务。

---

## 📚 更多文档

- 了解详细的 API 接口设计，请参阅：[API 文档](./docs/API.md)
- 了解系统功能和具体使用方法，请参阅：[用户操作手册](./docs/USER_MANUAL.md)