## Why

项目虽然已经具备 Vite library mode、类型声明和 npm 导出配置的基础骨架，但尚未形成可复用组件、开发预览、自动化 UI 测试与发布验证闭环。现在以 `SButton` 为首个纵向切片建立统一约定，可以在后续扩展复杂组件前固定公共 API、目录边界、调试方式和质量门槛。

## What Changes

- 完善可发布到 npm 的 Vue 3 组件库入口，支持默认插件安装、具名组件导入、样式子路径和 TypeScript 声明。
- 新增首个公共组件 `SButton`，定义视觉变体、尺寸、禁用、加载、块级布局、原生按钮类型、插槽、事件和原生属性透传等契约。
- 建立基于 Storybook Vue3/Vite 的源码/产物双轨组件工作台，使开发时可使用 HMR、Controls、Actions、Viewport、主题与 RTL 工具栏，并在发布前以真实公共入口验证 `dist` 产物。
- 建立分层 UI 测试体系，覆盖快速行为测试、真实浏览器交互、视觉回归和发布产物冒烟测试。
- 补充组件库目录约定、安装使用、开发调试、测试、构建和 npm 发布说明。
- 保持 Vue SFC Template 为公共组件默认写法，仅允许高度动态的内部渲染器按需使用 TSX。

## Capabilities

### New Capabilities

- `library-packaging`: 定义组件库的公共入口、安装方式、样式与类型产物、npm 包内容和发布前验证要求。
- `button-component`: 定义 `SButton` 的公共 Props、Slots、Events、交互和原生表单行为。
- `component-preview`: 定义 Storybook 源码 HMR 预览、构建产物预览、Story 组织与公共入口验证方式。
- `ui-quality-pipeline`: 定义组件行为测试、真实浏览器测试、视觉回归和产物冒烟测试要求。

### Modified Capabilities

无。

## Impact

- 受影响代码与配置：`src/` 组件、Story 与入口、`.storybook/`、测试配置、Vite 配置、TypeScript 配置、`package.json`、README 和 License；现有手写 `playground/` 将被移除。
- 新增开发依赖预计包括 Storybook Vue3/Vite、Docs、Themes，以及 Vitest、Vue Test Utils、DOM 模拟环境、Vitest Browser Mode 和 Playwright。
- npm 公共 API 将新增默认插件、`SButton` 具名导出和 `serenova-ui/style.css` 样式入口。
- 发布流程将新增类型检查、行为测试、浏览器测试、构建、包内容检查和发布 dry-run 等质量门槛。
