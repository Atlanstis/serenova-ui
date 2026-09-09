## Why

Button 已具备 Figma 明确要求的主要能力，但 `block` 扩展了额外布局契约，`ghostColorText` 不能影响文字按钮外观。现有 Storybook 示例混合多个主题、部分 Controls 不生效，且纯图标调试可能呈现空按钮，需要收敛 API 并改善展示。

## What Changes

- **BREAKING**：移除 `ButtonProps.block`、对应块级样式和纯图标优先级规则；满宽布局迁移为消费端 class/style。
- **BREAKING**：移除 `ButtonThemeTokens.ghostColorText` 及其主题键登记和默认生成；其余主题覆盖能力保持有效。
- 将 Button Stories 重组为基础用法、类型与外观、尺寸、禁用与加载、图标用法、交互反馈六个主题。
- 移除 `Form` Story 及专用样式，保留组件 `nativeType`、原生表单行为和相关自动化测试。
- 修复 Playground 纯图标空白、Controls 与渲染脱节、Interaction 的固定点击断言问题；Text 的 Ghost 展示位置标注不适用。
- 保留五种变体、三档尺寸、Ghost、前后图标、纯图标、加载、禁用、键盘焦点和点击波纹。
- 本次不调整 `disabledOpacity`、共享主题架构、Pressed 内容偏移或 Primary 状态投影；后两项作为独立设计还原问题处理。

## Capabilities

### New Capabilities

无。

### Modified Capabilities

- `button-component`：移除块级布局 API 及关联组合契约，保留其余公共行为。
- `theme-provider`：明确 Button 主题覆盖不再接受无效的 `ghostColorText`。
- `component-preview`：定义六个 Button 展示主题、有效参数调试和不适用组合的呈现，移除表单及块级展示。

## Impact

- 涉及 `src/components/button/` 的组件、公共类型、主题解析、Stories 和专用 CSS。
- 同步 Button 源码类型测试、公共出口测试、共享包消费 Fixture，以及 Button、Icon、ThemeProvider 中引用旧契约的验证说明。
- unit、integration、现有消费应用 E2E 与 package 回归均需评估并执行；补充测试类型检查和 Storybook 类型检查，不将 Storybook 作为发布测试载体。
- 不新增依赖，不修改 Figma 文件。移除公开字段属于破坏性变更，需要提供迁移说明；删除 Story 会使对应旧 Story 链接失效。
