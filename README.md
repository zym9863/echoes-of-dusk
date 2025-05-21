# 暮色回响 | Echoes of Dusk

[中文](README.md) | [English](README_EN.md)

一个沉浸式的3D灯塔与海洋场景，使用Three.js和TypeScript构建。

## 项目简介

"暮色回响"是一个互动式3D网页应用，呈现了一个宁静的灯塔与海洋场景。用户可以在暮色环境中探索场景，与灯塔互动，聆听海浪声，体验沉浸式的视听享受。

### 主要特点

- 逼真的3D灯塔和海洋环境
- 动态天空系统，呈现从黎明到黄昏再到夜晚的变化
- 互动式灯塔灯光，可点击开关
- 逼真的云层、星空和月亮效果
- 沉浸式音频体验，包括海浪和灯塔声音
- 响应式设计，适配不同屏幕尺寸

## 技术栈

- **TypeScript** - 提供类型安全的JavaScript开发体验
- **Vite** - 现代前端构建工具，提供快速的开发体验
- **Three.js** - 强大的3D图形库，用于创建和显示3D内容
- **Web Audio API** - 通过Three.js的音频系统实现沉浸式音效

## 安装与运行

### 前提条件

- Node.js (推荐v18或更高版本)
- npm或yarn包管理器

### 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/zym9863/echoes-of-dusk.git
cd echoes-of-dusk
```

2. 安装依赖：

```bash
npm install
# 或
yarn
```

3. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
```

4. 打开浏览器访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建后的文件将位于 `dist` 目录中。

## 使用指南

- **点击灯塔**：使灯塔发光
- **拖动鼠标**：改变视角，探索场景
- **音频控制**：使用界面上的控制按钮开关音频和调整音量

## 项目结构

```
echoes-of-dusk/
├── public/             # 静态资源
├── src/                # 源代码
│   ├── assets/         # 资源文件（音频等）
│   ├── audio/          # 音频管理
│   ├── scene/          # 场景相关组件
│   │   ├── components/ # 场景中的各个组件（灯塔、天空等）
│   │   └── SceneManager.ts # 场景管理器
│   ├── main.ts         # 应用入口
│   └── style.css       # 全局样式
├── index.html          # HTML入口
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript配置
└── vite.config.js      # Vite配置
```

## 主要组件

### 场景管理器 (SceneManager)

负责初始化和管理整个3D场景，包括相机、渲染器和各个场景组件。

### 灯塔 (Lighthouse)

场景的中心元素，用户可以与之互动。包含灯塔结构和可开关的灯光效果。

### 天空系统 (Sky)

动态天空系统，根据时间变化颜色，从黎明到黄昏再到夜晚。

### 地形 (Terrain)

包括地面、山脉、水面和灯塔所在的小山丘。

### 云层 (Clouds)

动态移动的云层，增加场景的真实感。

### 星空 (Stars)

夜间可见的星星和月亮，随时间变化可见度。

### 音频管理器 (AudioManager)

管理场景中的音频效果，包括环境音（海浪、风声）和灯塔声音。

## 贡献指南

欢迎贡献！如果你想为项目做出贡献，请遵循以下步骤：

1. Fork 仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 致谢

- [Three.js](https://threejs.org/) - 强大的3D图形库
- [Vite](https://vitejs.dev/) - 现代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript的超集
