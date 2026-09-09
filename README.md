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

组件样式需显式导入：全量使用加载 `serenova-ui/style.css`，按需使用加载对应组件样式。

### 全量安装

```ts
import { createApp } from 'vue'
import SerenovaUI from 'serenova-ui'
import 'serenova-ui/style.css'

import App from './App.vue'

createApp(App).use(SerenovaUI).mount('#app')
```

### 按需导入

从组件子路径导入组件及其样式，无需额外主题初始化：

```ts
import { SButton } from 'serenova-ui/button'
import 'serenova-ui/button/style.css'
```

### 主题

```vue
<script setup lang="ts">
import { SButton } from 'serenova-ui/button'
import { SThemeProvider } from 'serenova-ui/theme-provider'
import { lightPreset } from 'serenova-ui/themes/light'
import 'serenova-ui/button/style.css'
</script>

<template>
  <SThemeProvider :preset="lightPreset">
    <SButton variant="primary">保存</SButton>
  </SThemeProvider>
</template>
```

Provider 不增加 DOM；无 Provider 时使用默认浅色主题。预设可响应式切换，内层 `inherit=false` 恢复默认主题，`tokens` 支持共享与组件覆盖。公共 API 详见 Storybook Docs，完整实现规则见 [样式与主题规范](./docs/styling-and-theming.md)。

**迁移：** Button 默认改为 primary，移除 default；danger 改为 error，主题字段中的 Danger 同步改为 Error。原 default 请按意图选择 primary、primary+ghost 或 text。内置暗色预设及其子路径已移除，使用浅色预设或 Provider 自定义覆盖。全量 CSS 保留原入口，不向全局注入主题。

### SVG 图标

六个具名内联 SVG 组件支持外部独立使用，无需 CSS 或 SVG loader：

```vue
<script setup lang="ts">
import { SButton, SIconAdd } from 'serenova-ui'
import { SIconArrowRight } from 'serenova-ui/icons'
import 'serenova-ui/style.css'
</script>

<template>
  <SIconAdd :size="24" color="#7c3aed" />
  <SButton variant="error" ghost>
    <template #icon><SIconAdd /></template>
    操作
    <template #suffixIcon><SIconArrowRight /></template>
  </SButton>
</template>
```

图标包括 Add、Delete、Edit、Search、ArrowRight、Loading，均使用 SIcon 前缀。size 默认 24，color 缺省继承文字色；Button 内默认 16 px。图标仅提供包根和 icons 集合入口。通过 `pnpm icons:generate` 更新生成文件，`pnpm icons:check` 验证同步；来源见 [图标资产](./assets/icons/README.md)。

## 本地开发

首次安装依赖和 Chromium：

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

```bash
pnpm dev
```

Storybook 默认运行在 [http://localhost:6006](http://localhost:6006)，提供 Docs、Controls、Actions、Interactions、浅色局部覆盖、RTL 和常见视口工具。

Storybook 仅用于开发过程的源码预览，通过组件公共名称映射加载源码，SFC 自身提供样式并支持 Vite HMR。发布产物由构建和包级冒烟测试独立验证。

单个组件的 API、示例和交互说明统一由 Storybook Docs 与对应 Story 承载，README 只保留组件库级别的使用和维护信息。

## 代码组织

```text
src/
├── components/         # 公共组件
│   ├── button/         # src、theme、stories 与公共入口
│   ├── icon/           # 生成 SVG 组件、公共类型与图标集合入口
│   └── theme-provider/ # 无 DOM 主题组件、Story 与公共入口
├── theme/              # 共享主题类型、上下文、合并与 presets
├── shared/             # 跨领域内部辅助
├── plugin.ts           # 全量组件安装
└── index.ts            # 公共 API 出口
.storybook/             # Storybook 全局配置
tests/                  # 自动化测试与测试基础设施工作区
├── components/         # 按公共组件聚合单元、集成测试与局部 Fixture
├── shared/             # 共享源码测试
├── e2e/                # 基于 dist 的消费应用与代表性用户流程
├── contracts/          # dist 发布产物消费契约
└── support/            # 跨领域共享 setup 与 helper
```

新增公共组件时应沿用源码领域结构，组件放在 `src/components/`，并由 `src/plugin.ts` 汇总全量安装列表；对应测试统一放在 `tests/components/<组件领域>/`，使用文件后缀标识运行环境。公共组件默认使用 `<script setup lang="ts">`、Template 和 scoped CSS；仅在递归、Schema 或高度动态 VNode 场景下考虑内部 TSX。

## 质量验证

### 命令总览

命令按日常使用优先级排列；聚合入口优先用于常规工作，细分入口用于定位问题或验证特定层级。

| 优先级 | 命令                        | 作用与适用时机                                          |
| ------ | --------------------------- | ------------------------------------------------------- |
| 开发   | `pnpm dev`                  | 启动源码 Storybook，用于组件预览、文档查阅和交互调试    |
| 构建   | `pnpm build`                | 检查组件库源码类型并生成 JavaScript、CSS 和类型声明产物 |
| 聚合   | `pnpm check`                | 运行格式、Lint、完整类型检查和快速单元测试，适合提交前  |
| 聚合   | `pnpm quality`              | 在 `check` 基础上运行集成、E2E 和发布包验证             |
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
| 测试   | `pnpm test:integration`     | 在 Chromium 中验证原生行为、焦点、布局和组件协作        |
| 测试   | `pnpm test:e2e`             | 构建组件库并在最小消费应用中运行代表性 Playwright 流程  |
| 测试   | `pnpm test:package`         | 先构建，再验证发布包入口、类型、样式、导出和文件边界    |
| 发布   | `pnpm pack:check`           | 构建并展示 `npm pack --dry-run` 文件清单                |
| 发布   | `pnpm publish:dry-run`      | 模拟 npm 发布流程，不上传包                             |
| 钩子   | `pnpm prepublishOnly`       | npm 发布前自动执行完整 `quality`                        |
| 钩子   | `pnpm prepare`              | 安装或更新 Husky Git hooks，通常由依赖安装过程自动调用  |

### 测试分层

| 层级                 | 目录                         | 命令                    | 覆盖范围                                             |
| -------------------- | ---------------------------- | ----------------------- | ---------------------------------------------------- |
| 快速单元测试         | `tests/components`、`shared` | `pnpm test:unit`        | Props、Slots、Events、状态、公共类型和安装辅助       |
| 真实浏览器集成测试   | `tests/components`           | `pnpm test:integration` | 原生行为、焦点、键盘、布局、尺寸、样式和组件协作     |
| 消费应用 E2E         | `tests/e2e`                  | `pnpm test:e2e`         | 当前 dist 的公共安装、样式加载和代表性关键用户流程   |
| 独立发布产物契约测试 | `tests/contracts/package`    | `pnpm test:package`     | ESM、CommonJS、CSS 子路径、插件、公共类型和 npm 内容 |

各测试层的职责边界、当前覆盖项与新增用例约定详见 [`tests/README.md`](./tests/README.md)。

每个公共组件必须具有快速黑盒单元测试；只有公共契约依赖真实浏览器行为、布局或组件协作时才增加集成测试。E2E 按代表性用户流程组织，不要求每个组件单独具有 E2E。Storybook 仅用于开发预览、交互调试和组件文档，不属于自动化测试金字塔。

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
├── button/             # JS、CommonJS、声明与 style.css
├── theme-provider/     # JS、CommonJS 与声明
├── icons/              # 图标集合 ESM/CommonJS
├── themes/             # 浅色预设与声明
└── ...共享模块与内部 CSS 资产
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

### 文字按钮与语义类型组合

```vue
<SButton text>查看详情</SButton>
<SButton variant="error" text>删除</SButton>
<SButton variant="success" text>确认</SButton>
```

`text` 和 `ghost` 均默认为 `false`，同时使用时 `text` 优先。文字按钮不设最小宽度、水平内边距为 0，多个文字操作由容器 `gap` 控制间距；纯图标按钮保持正方形。旧 `variant="text"` 需迁移为 `text`，`buttonVariants` 仅保留四种语义类型，主题字段迁移见 [主题文档](docs/styling-and-theming.md)。
