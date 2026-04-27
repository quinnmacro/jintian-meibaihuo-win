# 今天没白活 · Windows 版

> 置顶浮动的像素风待办小窗 · Windows port

原项目 [JintianMeiBaihuo](https://github.com/lijigang/JintianMeiBaihuo) 的 Windows 移植版本。

## 核心特性（目标）

- 🪟 **置顶浮动** — 始终在所有窗口之上
- 🖱️ **可拖动** — 点背景拖动到任意位置
- 👻 **透明度可调** — 30%–100% 自由调节
- 🕹️ **像素风视觉** — 6 色复古调色板 + 等宽字体 + 零圆角
- 💾 **本地持久化** — JSON 文件存储，不联网

## 技术栈

- **前端**: React + TypeScript + CSS
- **后端**: Tauri (Rust)
- **打包**: ~10MB 单文件 exe

## 项目结构

```
jintian-meibaihuo-win/
├── reference-macos/     # 原 macOS 版本 (submodule)
├── src/                 # React 前端源码
│   ├── components/      # UI 组件
│   ├── hooks/           # 自定义 hooks
│   ├── store/           # 数据存储逻辑
│   ├── theme/           # 像素风主题
│   └── App.tsx
├── src-tauri/           # Rust 后端
│   ├── src/
│   │   └── main.rs      # 窗口配置、置顶、透明度
│   └── tauri.conf.json
├── package.json
└── README.md
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run tauri dev

# 构建
npm run tauri build
```

## 原项目设计哲学（保留）

像素风 6 条生成规则：

1. **限定调色板** ≤6 色
2. **零圆角 + 硬边框**
3. **4/8 倍数间距**
4. **重字重等宽字体**
5. **Unicode 几何符号** (■ □ × ▸ ◇)
6. **零动画**

## 参考文件

原项目核心文件位于 `reference-macos/Sources/JintianMeiBaihuo/`:

- `PixelTheme.swift` — 调色板、字体、间距定义
- `TodoStore.swift` — 数据持久化逻辑
- `ContentView.swift` — 主界面布局
- `TodoRow.swift` — 待办行组件
- `App.swift` — 窗口置顶、透明度配置

## License

MIT