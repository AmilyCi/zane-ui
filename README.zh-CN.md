# @zanejs/ui

<div align="center">
  <a href="https://zanejs.com"><img alt="zanejs logo" width="215" src="https://unpkg.com/@zanejs/icons@1.0.1/dist/logo.svg"></a>

[![npm version](https://img.shields.io/npm/v/@zanejs/ui.svg)](https://www.npmjs.com/package/@zanejs/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stencil](https://img.shields.io/badge/Stencil-4.41.1-blue.svg)](https://stenciljs.com/)


**中文** | [English](./README.md)

</div>

## 简介

一个基于 [Stencil.js](https://stenciljs.com/) 开发的现代化、轻量级原生 Web Components UI 组件库。不受框架限制，运行在 JS/Vue/React/Angular 项目，提供完整的 TypeScript 类型支持。

## 特性

- **基于 Stencil.js**：使用标准的 Web Components 标准，兼容任何前端框架
- **框架无关**：原生 Web Components，可在任何框架中使用
- **轻量级**：按需加载，最小化 bundle 大小
- **现代化设计**：简洁美观的界面设计
- **TypeScript 支持**：完整的类型定义和智能提示
- **国际化**：支持中英文双语
- **响应式设计**：适配各种屏幕尺寸
- **可定制主题**：支持主题定制和配置

## 安装

### npm

```bash
npm install @zanejs/ui
```

### pnpm

```bash
pnpm add @zanejs/ui
```

### yarn

```bash
yarn add @zanejs/ui
```

## 快速开始

### 基础使用

在 HTML 文件中直接引入：

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/@zanejs/ui@1.0.1/dist/zane-ui/zane-ui.esm.js"></script>
  </head>
  <body>
    <zane-button type="primary">Hello Zane UI</zane-button>
  </body>
</html>
```

### 在框架中使用

#### React 示例

```diff
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

+ import { defineCustomElements } from '@zanejs/ui/loader';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

+ defineCustomElements();

```

#### Vue 示例

```diff
// src/main.ts

import { createApp } from 'vue'
import App from './App.vue';
+ import { defineCustomElements } from '@zanejs/ui/loader';

+ defineCustomElements();

createApp(App).mount('#app')
```

修改 vite.config.js，vue 编译兼容自定义元素

```diff
import { defineConfig } from 'vite';

export default defineConfig({
  vue: {
    template: {
      compilerOptions: {
+        isCustomElement: tag => tag.startsWith('zane-')
      },
    },
  },
});
```


## 可用组件

### 基础组件

- **[Button](src/components/button/)** - 按钮组件，支持多种样式和状态
- **[Input](src/components/input/)** - 输入框组件，支持多种类型
- **[Tag](src/components/tag/)** - 标签组件，用于标记和选择
- **[Avatar](src/components/avatar/)** - 头像组件
- **[Icon](src/components/icon/)** - 图标组件
- **[Link](src/components/link/)** - 链接组件
- **[Text](src/components/text/)** - 文本组件

### 表单组件

- **[Form](src/components/form/)** - 表单组件，提供表单验证
- **[Autocomplete](src/components/autocomplete/)** - 自动完成组件
- **[Cascader](src/components/cascader/)** - 级联选择器

### 布局组件

- **[Container](src/components/container/)** - 容器组件
- **[Header](src/components/header/)** - 顶部布局
- **[Footer](src/components/footer/)** - 底部布局
- **[Main](src/components/main/)** - 主内容区
- **[Aside](src/components/aside/)** - 侧边栏
- **[Row](src/components/row/)** - 栅格行
- **[Col](src/components/col/)** - 栅格列
- **[Divider](src/components/divider/)** - 分割线

### 反馈组件

- **[Tooltip](src/components/tooltip/)** - 文字提示
- **[Collapse](src/components/collapse/)** - 折叠面板

### 其他组件

- **[Card](src/components/card/)** - 卡片组件
- **[Scrollbar](src/components/scrollbar/)** - 自定义滚动条
- **[Splitter](src/components/splitter/)** - 分割面板
- **[FocusTrap](src/components/focus-trap/)** - 焦点捕获

## 🛠️ 开发

### 环境要求

- Node.js >= 18.x
- pnpm >= 8.x

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动开发服务器（支持热重载）
pnpm run dev
```

### 构建项目

```bash
# 构建生产版本
pnpm run build

# 仅生成文档
pnpm run build:docs-only

# 生成组件
pnpm run generate
```

### 运行测试

```bash
# 运行所有测试
pnpm run test

# 监听模式运行测试
pnpm run test.watch
```

## 项目结构

```
zane-ui/
├── src/
│   ├── components/          # 组件源码
│   │   ├── button/          # 按钮组件
│   │   ├── input/           # 输入框组件
│   │   ├── form/            # 表单组件
│   │   ├── ...              # 其他组件
│   ├── global/              # 全局配置
│   │   ├── theme/           # 主题样式
│   │   └── store.ts         # 全局状态
│   ├── utils/               # 工具函数
│   ├── hooks/               # 自定义 Hooks
│   ├── types/               # TypeScript 类型定义
│   ├── locale/              # 国际化语言包
│   └── index.ts             # 入口文件
├── dist/                    # 构建输出目录
├── loader/                  # 动态加载器
├── www/                     # 示例页面
└── stencil.config.ts        # Stencil 配置文件
```

## 主题定制

项目支持主题定制，您可以通过修改 `src/global/theme/` 目录下的 SCSS 文件来定制主题：

```scss
// 自定义主题变量
:root {
  --zane-primary-color: #1890ff;
  --zane-success-color: #52c41a;
  --zane-warning-color: #faad14;
  --zane-danger-color: #f5222d;
}
```

## 国际化

项目内置了中英文支持，可以通过 `zane-config-provider` 组件进行全局配置：

```tsx
<zane-config-provider locale="zh-cn">
  <App />
</zane-config-provider>

<zane-config-provider locale="en">
  <App />
</zane-config-provider>
```

## 贡献指南

我们欢迎所有形式的贡献！无论是报告 Bug、提交功能建议还是代码贡献。

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

## 致谢

感谢以下开源项目：

- [Stencil.js](https://stenciljs.com/) - 编译器
- [@ctrl/tinycolor](https://github.com/scttcper/tinycolor) - 颜色处理
- [@floating-ui/dom](https://floating-ui.com/) - 浮动元素定位
- [@popperjs/core](https://popper.js.org/) - 工具提示定位

## 联系我们

- 提交 Issue：[GitHub Issues](https://github.com/zanedeng/zane-ui/issues)
- 参与讨论：[GitHub Discussions](https://github.com/zanedeng/zane-ui/discussions)

---

如果这个项目对您有帮助，请给我们一个 ⭐️！
