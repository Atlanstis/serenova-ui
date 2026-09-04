# component-preview Specification

## Purpose

定义基于 Storybook 的组件开发工作台，使维护者能够快速调试源码、复现交互并查阅组件文档，同时与自动化组件测试和发布质量门槛保持职责分离。

## Requirements

### Requirement: 提供源码 HMR 预览

Storybook SHALL 仅作为开发过程中的源码预览工作台，通过包公共名称解析到组件库源码，并 MUST 在组件或样式修改后提供热更新反馈；仓库 MUST 提供单一、明确的开发命令启动该工作台。

#### Scenario: 修改 Button 源码

- **WHEN** 维护者启动 Storybook 开发预览并修改 `SButton` 的模板、逻辑或样式
- **THEN** 当前 Story 在不重新构建 npm 包的情况下更新显示结果

#### Scenario: 启动开发预览

- **WHEN** 维护者需要浏览组件文档或调试 Story 交互
- **THEN** 维护者通过唯一的开发预览入口启动源码 Storybook，无需选择源码、产物或静态站点模式

### Requirement: Story 使用真实消费方式

所有组件 Story MUST 从 `serenova-ui` 公共入口导入组件并从 `serenova-ui/style.css` 导入样式，且 SHALL 与发布构建隔离。

#### Scenario: 新增组件 Story

- **WHEN** 维护者为公共组件新增 Story
- **THEN** Story 通过公共 API 使用组件，并且 Story 与 Storybook 配置不进入 npm 发布产物

### Requirement: 提供组件工作台能力

Storybook SHALL 自动发现组件 Story，并 SHALL 提供 Docs、Controls、Actions 和 Viewport 能力；关键交互 SHALL 可通过 Story 的 `play` 函数复现和调试，但 Storybook 及 `play` 函数的 Playwright 自动执行 SHALL NOT 作为组件库 E2E 或完整质量门槛。

#### Scenario: 调节 Button Props 并观察事件

- **WHEN** 维护者在组件 Story 中修改公共 Props 并触发交互
- **THEN** Canvas 按参数重新渲染，且 Actions 或供调试使用的 `play` 函数能够观察公共事件

#### Scenario: 查阅组件说明

- **WHEN** 维护者打开组件 Docs 页面
- **THEN** Storybook 基于组件元数据和 Story 展示公共参数、示例与交互说明

#### Scenario: 执行完整质量检查

- **WHEN** 仓库运行自动化完整质量入口
- **THEN** 流程不启动 Storybook，也不通过 Story 发现、主题、RTL、视口或 `play` 执行结果判定组件库是否可发布

### Requirement: Storybook 与自动化测试职责分离

Storybook SHALL 仅作为开发预览、交互调试和组件文档工作台。组件公共行为 MUST 由单元测试、适用的真实浏览器集成测试或消费应用 E2E 验证，Story 的存在与手工可用性 SHALL NOT 替代这些测试。

#### Scenario: Storybook 环境发生故障

- **WHEN** Storybook 的开发环境、主题装饰器或调试用 `play` 函数发生故障
- **THEN** 该问题作为开发工作台问题处理，不由消费应用 E2E 承担 Storybook 环境验证职责

#### Scenario: Story 展示关键交互

- **WHEN** Story 展示一个属于组件公共契约的关键交互
- **THEN** 对应契约仍由适用的单元、集成或 E2E 测试独立验证

### Requirement: 覆盖 Button 关键状态

Storybook SHALL 展示 `SButton` 的基础用法、视觉变体、尺寸、禁用、加载、块级布局、插槽和事件，并 SHALL 支持检查主题、RTL 与常见视口。

#### Scenario: 检查 Button 状态矩阵

- **WHEN** 维护者打开 Button 预览
- **THEN** 维护者可以在同一组件分类查看关键 Story 并观察交互事件

#### Scenario: 检查不同显示环境

- **WHEN** 维护者切换主题、RTL 或预览视口
- **THEN** Button Story 在所选环境中重新呈现且无需修改组件源码

### Requirement: Storybook 配置保持轻量职责

`.storybook` 配置 SHALL 只负责框架集成、Story 发现和全局预览环境，不得承载公共组件实现或与 Story 无关的业务状态。

#### Scenario: 扩展新的组件分类

- **WHEN** 仓库增加新的组件及其 Story
- **THEN** Storybook 自动发现对应分类与示例，不需要修改自建导航或复制组件实现逻辑
