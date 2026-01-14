# @zanejs/ui

<div align="center">
  <a href="https://zanejs.com"><img alt="zanejs logo" width="215" src="https://unpkg.com/@zanejs/icons@1.0.1/dist/logo.svg"></a>

[![npm version](https://img.shields.io/npm/v/@zanejs/ui.svg)](https://www.npmjs.com/package/@zanejs/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stencil](https://img.shields.io/badge/Stencil-4.41.1-blue.svg)](https://stenciljs.com/)

**English** | [中文](./README.zh-CN.md)

</div>

## Introduction

A modern, lightweight native Web Components UI library built with [Stencil.js](https://stenciljs.com/). Framework-agnostic, works in JS/Vue/React/Angular projects, and provides complete TypeScript type support.

## Features

- **Built with Stencil.js**: Uses standard Web Components standards, compatible with any frontend framework
- **Framework-agnostic**: Native Web Components, usable in any framework
- **Lightweight**: Load on demand, minimized bundle size
- **Modern Design**: Clean and beautiful interface design
- **TypeScript Support**: Complete type definitions and intelligent code completion
- **Internationalization**: Supports both Chinese and English
- **Responsive Design**: Adapts to various screen sizes
- **Customizable Theme**: Supports theme customization and configuration

## Installation

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

## Quick Start

### Basic Usage

Directly include in HTML file:

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

### Usage in Frameworks

#### React Example

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

#### Vue Example

```diff
// src/main.ts

import { createApp } from 'vue'
import App from './App.vue';
+ import { defineCustomElements } from '@zanejs/ui/loader';

+ defineCustomElements();

createApp(App).mount('#app')
```

Modify vite.config.js for Vue compilation compatibility with custom elements:

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

## Available Components

### Basic Components

- **[Button](src/components/button/)** - Button component with various styles and states
- **[Input](src/components/input/)** - Input component supporting multiple types
- **[Tag](src/components/tag/)** - Tag component for labeling and selection
- **[Avatar](src/components/avatar/)** - Avatar component
- **[Icon](src/components/icon/)** - Icon component
- **[Link](src/components/link/)** - Link component
- **[Text](src/components/text/)** - Text component

### Form Components

- **[Form](src/components/form/)** - Form component with validation support
- **[Autocomplete](src/components/autocomplete/)** - Autocomplete component
- **[Cascader](src/components/cascader/)** - Cascader selector

### Layout Components

- **[Container](src/components/container/)** - Container component
- **[Header](src/components/header/)** - Header layout
- **[Footer](src/components/footer/)** - Footer layout
- **[Main](src/components/main/)** - Main content area
- **[Aside](src/components/aside/)** - Sidebar
- **[Row](src/components/row/)** - Grid row
- **[Col](src/components/col/)** - Grid column
- **[Divider](src/components/divider/)** - Divider

### Feedback Components

- **[Tooltip](src/components/tooltip/)** - Text tooltip
- **[Collapse](src/components/collapse/)** - Collapse panel

### Other Components

- **[Card](src/components/card/)** - Card component
- **[Scrollbar](src/components/scrollbar/)** - Custom scrollbar
- **[Splitter](src/components/splitter/)** - Split panel
- **[FocusTrap](src/components/focus-trap/)** - Focus trap

## 🛠️ Development

### Requirements

- Node.js >= 18.x
- pnpm >= 8.x

### Install Dependencies

```bash
pnpm install
```

### Development Mode

```bash
# Start development server (with hot reload)
pnpm run dev
```

### Build Project

```bash
# Build production version
pnpm run build

# Generate documentation only
pnpm run build:docs-only

# Generate components
pnpm run generate
```

### Run Tests

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test.watch
```

## Project Structure

```
zane-ui/
├── src/
│   ├── components/          # Component source code
│   │   ├── button/          # Button component
│   │   ├── input/           # Input component
│   │   ├── form/            # Form component
│   │   ├── ...              # Other components
│   ├── global/              # Global configuration
│   │   ├── theme/           # Theme styles
│   │   └── store.ts         # Global state
│   ├── utils/               # Utility functions
│   ├── hooks/               # Custom Hooks
│   ├── types/               # TypeScript type definitions
│   ├── locale/              # Internationalization language packs
│   └── index.ts             # Entry file
├── dist/                    # Build output directory
├── loader/                  # Dynamic loader
├── www/                     # Example pages
└── stencil.config.ts        # Stencil configuration file
```

## Theme Customization

The project supports theme customization. You can customize themes by modifying SCSS files in the `src/global/theme/` directory:

```scss
// Custom theme variables
:root {
  --zane-primary-color: #1890ff;
  --zane-success-color: #52c41a;
  --zane-warning-color: #faad14;
  --zane-danger-color: #f5222d;
}
```

## Internationalization

The project has built-in Chinese and English support. You can configure globally using the `zane-config-provider` component:

```tsx
<zane-config-provider locale="zh-cn">
  <App />
</zane-config-provider>

<zane-config-provider locale="en">
  <App />
</zane-config-provider>
```

## Contribution Guidelines

We welcome all forms of contributions! Whether it's reporting bugs, suggesting features, or contributing code.

1. Fork this project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open-sourced under the [MIT](LICENSE) license.

## Acknowledgments

Thanks to the following open-source projects:

- [Stencil.js](https://stenciljs.com/) - Compiler
- [@ctrl/tinycolor](https://github.com/scttcper/tinycolor) - Color handling
- [@floating-ui/dom](https://floating-ui.com/) - Floating element positioning
- [@popperjs/core](https://popper.js.org/) - Tooltip positioning

## Contact Us

- Submit Issues: [GitHub Issues](https://github.com/zanedeng/zane-ui/issues)
- Join Discussions: [GitHub Discussions](https://github.com/zanedeng/zane-ui/discussions)

---

If this project helps you, please give us a ⭐️!
