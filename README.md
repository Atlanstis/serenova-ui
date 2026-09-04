# Serenova UI

基于 Vue 3、TypeScript 和 Vite 构建的 UI 组件库，提供 Storybook 开发环境、分层测试和 npm 发布前验证。

> 当前版本为 `0.0.0`。首次公开发布前仍需设置正式版本，并确认 npm 包名可用。

## 环境要求

- Node.js `>=22.13.0`
- pnpm `>=11.24.0`
- Vue `^3.5.0`

## 安装与使用

```bash
pnpm add serenova-ui
```

无论全量安装还是按需导入，都需要显式引入样式：

```ts
import 'serenova-ui/style.css'
```

### 全量安装

```ts
import { createApp } from 'vue'
import SerenovaUI from 'serenova-ui'
import 'serenova-ui/style.css'

import App from './App.vue'

createApp(App).use(SerenovaUI).mount('#app')
```

### 按需导入

按需使用时，从 `serenova-ui` 包根导入需要的具名组件，并在业务组件中直接使用。可用组件、导出名称、API 与交互示例统一在 Storybook Docs 中查阅；样式入口仍需单独导入。

## 本地开发

首次安装依赖和 Chromium：

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

```bash
pnpm dev
```

Storybook 默认运行在 [http://localhost:6006](http://localhost:6006)，提供 Docs、Controls、Actions、Interactions、主题、RTL 和常见视口工具。

Storybook 仅用于开发过程的源码预览，通过 `serenova-ui` 与 `serenova-ui/style.css` 公共名称加载源码并支持 Vite HMR。发布产物由构建和包级冒烟测试独立验证。

单个组件的 API、示例和交互说明统一由 Storybook Docs 与对应 Story 承载，README 只保留组件库级别的使用和维护信息。

## 代码组织

```text
src/
├── <component>/        # 按组件领域共置源码、Story 与公共入口
├── shared/             # 共享安装辅助
├── styles/             # 全局样式与设计令牌
├── bundle-entry.ts     # Vite 构建入口
├── components.ts       # 全量安装组件清单
└── index.ts            # 公共 API
.storybook/             # Storybook 全局配置
tests/                  # 自动化测试与测试基础设施工作区
├── components/         # 按公共组件聚合测试与局部 Fixture
├── shared/             # 共享源码测试
├── integration/        # Storybook 等跨组件集成测试
├── contracts/          # dist 发布产物消费契约
└── support/            # 跨领域共享 setup 与 helper
```

新增公共组件时应沿用源码领域结构，并由 `src/components.ts` 汇总全量安装列表；对应测试统一放在 `tests/components/<组件领域>/`，使用文件后缀标识运行环境。公共组件默认使用 `<script setup lang="ts">`、Template 和 scoped CSS；仅在递归、Schema 或高度动态 VNode 场景下考虑内部 TSX。

## 质量验证

### 命令总览

命令按日常使用优先级排列；聚合入口优先用于常规工作，细分入口用于定位问题或验证特定层级。

| 优先级 | 命令                        | 作用与适用时机                                          |
| ------ | --------------------------- | ------------------------------------------------------- |
| 开发   | `pnpm dev`                  | 启动源码 Storybook，用于组件预览、文档查阅和交互调试    |
| 构建   | `pnpm build`                | 检查组件库源码类型并生成 JavaScript、CSS 和类型声明产物 |
| 聚合   | `pnpm check`                | 运行格式、Lint、完整类型检查和快速单元测试，适合提交前  |
| 聚合   | `pnpm quality`              | 在 `check` 基础上运行浏览器、预览和发布包验证           |
| 格式   | `pnpm format`               | 使用 Prettier 写入统一格式                              |
| 格式   | `pnpm format:check`         | 检查 Prettier 格式但不修改文件                          |
| 代码   | `pnpm lint`                 | 运行 ESLint，任何警告均视为失败                         |
| 代码   | `pnpm lint:fix`             | 自动修复 ESLint 可修复问题，并拒绝遗留警告              |
| 类型   | `pnpm type-check`           | 聚合检查组件库、Storybook 和测试工作区                  |
| 类型   | `pnpm type-check:lib`       | 仅检查组件库源码类型                                    |
| 类型   | `pnpm type-check:storybook` | 仅检查 Storybook 配置与 Story 类型                      |
| 类型   | `pnpm type-check:test`      | 仅检查测试工作区类型                                    |
| 测试   | `pnpm test`                 | npm 标准测试入口，委托快速单元测试                      |
| 测试   | `pnpm test:unit`            | 运行 happy-dom 中的快速组件黑盒与共享逻辑测试           |
| 测试   | `pnpm test:browser`         | 在 Chromium 中验证原生行为、焦点、布局和计算样式        |
| 测试   | `pnpm test:preview`         | 启动开发 Storybook 并运行 Playwright 预览集成测试       |
| 测试   | `pnpm test:package`         | 先构建，再验证发布包入口、类型、样式、导出和文件边界    |
| 发布   | `pnpm pack:check`           | 构建并展示 `npm pack --dry-run` 文件清单                |
| 发布   | `pnpm publish:dry-run`      | 模拟 npm 发布流程，不上传包                             |
| 钩子   | `pnpm prepublishOnly`       | npm 发布前自动执行完整 `quality`                        |
| 钩子   | `pnpm prepare`              | 安装或更新 Husky Git hooks，通常由依赖安装过程自动调用  |

### 测试分层

| 层级               | 目录                          | 命令                | 覆盖范围                                             |
| ------------------ | ----------------------------- | ------------------- | ---------------------------------------------------- |
| 快速组件测试       | `tests/components`、`shared`  | `pnpm test:unit`    | Props、Slots、Events、状态、公共类型和安装辅助       |
| 真实浏览器组件测试 | `tests/components`            | `pnpm test:browser` | 原生行为、焦点、键盘、布局、尺寸和计算样式           |
| Storybook 预览测试 | `tests/integration/storybook` | `pnpm test:preview` | Story 发现、参数、主题、RTL、视口和 `play` 交互      |
| 发布产物冒烟       | `tests/contracts/package`     | `pnpm test:package` | ESM、CommonJS、CSS 子路径、插件、公共类型和 npm 内容 |

各测试层的职责边界、当前覆盖项与新增用例约定详见 [`tests/README.md`](./tests/README.md)。

运行快速检查：

```bash
pnpm check
```

运行完整发布质量门槛：

```bash
pnpm quality
```

## 构建与产物

```bash
pnpm build
```

构建输出：

```text
dist/
├── serenova-ui.js
├── serenova-ui.cjs
├── serenova-ui.css
├── index.d.ts
└── ...组件声明文件
```

Vue 作为 `peerDependency` 从 JavaScript 产物中外置。可通过自带构建步骤的包级测试验证发布产物：

```bash
pnpm test:package
```

## npm 发布

首次发布前需要：

1. 将 `0.0.0` 更新为准备发布的语义化版本。
2. 确认 npm 包名仍然可用。

```bash
npm login
npm view serenova-ui
pnpm quality
pnpm pack:check
pnpm publish:dry-run
```

`npm pack --dry-run` 的文件列表应只包含 `dist`、`package.json`、`README.md` 和 `LICENSE`。确认版本、文件列表和账号无误后再发布：

```bash
npm publish --access public
```

`prepublishOnly` 会再次运行 `pnpm quality`，但不能替代版本、许可证、包名和发布文件的人工确认。

## License

本项目采用 MIT License，详见 [LICENSE](./LICENSE)。
