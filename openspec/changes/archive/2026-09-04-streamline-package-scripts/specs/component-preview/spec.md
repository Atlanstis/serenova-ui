## MODIFIED Requirements

### Requirement: 提供源码 HMR 预览

Storybook SHALL 仅作为开发过程中的源码预览工作台，通过包公共名称解析到组件库源码，并 MUST 在组件或样式修改后提供热更新反馈；仓库 MUST 提供单一、明确的开发命令启动该工作台。

#### Scenario: 修改 Button 源码

- **WHEN** 维护者启动 Storybook 开发预览并修改 `SButton` 的模板、逻辑或样式
- **THEN** 当前 Story 在不重新构建 npm 包的情况下更新显示结果

#### Scenario: 启动开发预览

- **WHEN** 维护者需要浏览组件文档或调试 Story 交互
- **THEN** 维护者通过唯一的开发预览入口启动源码 Storybook，无需选择源码、产物或静态站点模式

## REMOVED Requirements

### Requirement: 提供构建产物预览

**Reason**: Storybook 仅用于开发过程的源码预览与预览集成测试；发布产物已经由包级冒烟测试验证，继续维护 dist Storybook 会重复构建并扩大配置职责。

**Migration**: 使用源码 Storybook 进行组件预览和交互调试，使用发布构建与包级冒烟命令验证 ESM、CommonJS、CSS、类型声明、公共导出和 npm 包内容；移除 dist 预览、Storybook 静态构建及其生成目录。
