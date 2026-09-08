## Why

当前 Button 的颜色、尺寸、状态反馈和图标能力与 serenova-ui 的 Figma 设计不一致，内置暗色预设也缺乏设计依据。本变更以已读取的 Figma 浅色设计为基准，建立一致的按钮契约及可供外部使用的 SVG 图标组件。

## What Changes

- **BREAKING**：Button 移除 `default`、`danger`，使用 `primary / warning / success / error / text`，默认 `primary`；同步迁移公共类型及 danger 相关主题字段。
- 按 Figma 调整尺寸、颜色、字体、圆角、禁用配色、聚焦环及点击波纹；增加 `ghost`、`iconOnly` 和后置图标插槽。
- 提供六个具名内联 SVG 图标组件，由真实 Figma SVG 生成，支持尺寸、颜色继承、独立使用和全量安装；仅从包根和 `serenova-ui/icons` 导出，不提供单图标子路径。
- **BREAKING**：移除内置 `darkPreset` 及 `serenova-ui/themes/dark`，保留 light 预设和 Provider 局部覆盖能力。
- 更新 Storybook、文档、主题及包消费 Fixture，并验证源码和发布产物契约。

## Capabilities

### New Capabilities

- `icon-components`：真实矢量来源、内联 SVG 图标组件、公共属性和独立消费契约。

### Modified Capabilities

- `button-component`：Figma 浅色视觉、error 语义、图标组合、Ghost、纯图标和交互反馈。
- `theme-provider`：仅内置浅色预设，保留覆盖、继承、响应式和服务端隔离能力。
- `library-packaging`：图标集合入口、公共导出、按需打包边界及暗色入口移除。
- `component-preview`：展示新按钮和图标契约，移除暗色切换。

## Impact

- 涉及 `src/components/button/`、新增图标组件领域、`src/theme/`、公共出口和插件，以及 Vite 构建与 package.json 导出映射。
- 涉及 `.storybook/`、README、主题文档、测试类型路径及 unit/integration/E2E/package 各层测试；不改变现有测试体系。
- 图标转换在开发阶段执行，消费端不需要 SVG loader、运行时资源请求或新增运行时依赖。
- 设计依据：[Button 页面](https://www.figma.com/design/RXjt6R6Hhaz4NJP8fYw533/serenova-ui?node-id=3-60)、[Icon 页面](https://www.figma.com/design/RXjt6R6Hhaz4NJP8fYw533/serenova-ui?node-id=12-103)，读取日期为 2026-09-08。
