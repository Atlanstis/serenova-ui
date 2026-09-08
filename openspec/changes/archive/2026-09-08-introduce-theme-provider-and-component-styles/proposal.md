## Why

当前组件样式统一发布为 `serenova-ui/style.css`，组件增加后，按需使用仍会加载其他组件的 CSS。现有全局变量主题缺少局部配置、预设和明确的继承契约，需要在扩展组件前建立可独立消费的样式与主题基础。

## What Changes

- 新增无 DOM 的可选 `SThemeProvider`，通过 Vue 上下文传递主题预设和覆盖，支持嵌套、响应式切换及继承重置。
- 统一维护共享 token、组件 token 与默认主题；组件自行解析主题，并在自身 DOM 上绑定所需变量，无 Provider 时使用默认主题。
- 按组件发布静态 CSS 与 JS/类型子路径，保留全量 `serenova-ui/style.css`，普通 JS 入口不自动加载 CSS。
- 将 Button 接入新主题体系，以最小 Teleport Fixture 验证主题上下文，不新增实际浮层组件。
- **BREAKING**：全量 CSS 不再向 `:root` 注入主题或响应全局 `[data-theme='dark']`；旧的暗色切换需迁移到 Provider 与暗色预设。保留现有组件 Props、事件及默认外观。
- 新增 `docs/styling-and-theming.md`，说明方案、Naive UI 借鉴点、使用方式、迁移与 Figma 映射原则。

## Capabilities

### New Capabilities

- `theme-provider`：默认主题、预设、覆盖与继承，无 DOM Provider，以及跨 Teleport 的主题一致性。

### Modified Capabilities

- `library-packaging`：新增组件与主题子路径，定义按需 CSS、Node 消费和全量 CSS 的兼容边界。

## Impact

- 影响源码入口、Button、共享样式、主题模块、Vite 8/Rolldown 构建和包导出映射。
- 更新 README、Storybook 主题接入、源码出口测试、共享消费 Fixture、unit/integration/E2E/package 测试。
- 本轮不引入 Tailwind、css-render 或其他运行时样式引擎；不实现自动导入 resolver、主题类缓存、命令式浮层 API 或 Figma 自动同步。
- Figma 仅规划共享 token、Code Syntax 与组件 API 对齐，不修改远端设计文件。
