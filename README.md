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

| 命令                        | 用途                                       |
| --------------------------- | ------------------------------------------ |
| `pnpm dev`                  | 启动源码模式 Storybook，支持 Vite HMR      |
| `pnpm dev:dist`             | 构建组件库并使用 `dist` 产物启动 Storybook |
| `pnpm build:storybook`      | 构建源码模式静态站点                       |
| `pnpm build:storybook:dist` | 构建基于发布产物的静态站点                 |

Storybook 默认运行在 [http://localhost:6006](http://localhost:6006)，提供 Docs、Controls、Actions、Interactions、主题、RTL 和常见视口工具。

源码模式和产物模式均通过 `serenova-ui` 与 `serenova-ui/style.css` 公共入口加载。产物模式根据 `package.json` 的 `exports` 解析文件，并阻止回退读取组件源码或源码样式。

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
tests/                  # 全部自动化测试、Fixture 与测试辅助
├── unit/               # happy-dom 快速行为与公共类型测试
├── browser/            # Chromium 真实浏览器组件测试
├── preview/            # Storybook 集成与交互测试
├── visual/             # 视觉回归测试及截图基线
├── package/            # dist 发布产物消费冒烟测试
├── helpers/            # 跨测试层共享辅助
└── setup/              # Vitest 测试环境初始化
```

新增公共组件时应沿用源码领域结构，并由 `src/components.ts` 汇总全量安装列表；对应测试统一放在 `tests/<测试层>/<组件领域>/`，不在 `src/` 下新增测试目录。公共组件默认使用 `<script setup lang="ts">`、Template 和 scoped CSS；仅在递归、Schema 或高度动态 VNode 场景下考虑内部 TSX。

## 质量验证

| 层级               | 目录            | 命令                | 覆盖范围                                             |
| ------------------ | --------------- | ------------------- | ---------------------------------------------------- |
| 快速组件测试       | `tests/unit`    | `pnpm test:unit`    | Props、Slots、Events、状态、公共类型和安装辅助       |
| 真实浏览器组件测试 | `tests/browser` | `pnpm test:browser` | 表单、布局和计算样式                                 |
| Storybook 预览测试 | `tests/preview` | `pnpm test:preview` | Story 发现、参数、主题、RTL、视口和 `play` 交互      |
| 视觉回归           | `tests/visual`  | `pnpm test:visual`  | 固定 Chromium、视口、时区、字体和动画策略下的截图    |
| 全部 Playwright    | 上述两类        | `pnpm test:e2e`     | 单次启动 Storybook 后运行预览和视觉测试              |
| 发布产物冒烟       | `tests/package` | `pnpm test:package` | ESM、CommonJS、CSS 子路径、插件、公共类型和 npm 内容 |

各测试层的职责边界、当前覆盖项与新增用例约定详见 [`tests/README.md`](./tests/README.md)。

运行快速检查：

```bash
pnpm check
```

运行完整发布质量门槛：

```bash
pnpm quality
```

视觉基线与对应测试文件共置在 `tests/visual/**/*.spec.ts-snapshots/`。仅在确认视觉变更符合预期后更新：

```bash
pnpm exec playwright test --config playwright.config.ts tests/visual --update-snapshots
pnpm test:visual
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

Vue 作为 `peerDependency` 从 JavaScript 产物中外置。构建后可单独验证发布产物：

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
