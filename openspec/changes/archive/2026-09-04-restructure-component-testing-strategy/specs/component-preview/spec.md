## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Storybook 与自动化测试职责分离

Storybook SHALL 仅作为开发预览、交互调试和组件文档工作台。组件公共行为 MUST 由单元测试、适用的真实浏览器集成测试或消费应用 E2E 验证，Story 的存在与手工可用性 SHALL NOT 替代这些测试。

#### Scenario: Storybook 环境发生故障

- **WHEN** Storybook 的开发环境、主题装饰器或调试用 `play` 函数发生故障
- **THEN** 该问题作为开发工作台问题处理，不由消费应用 E2E 承担 Storybook 环境验证职责

#### Scenario: Story 展示关键交互

- **WHEN** Story 展示一个属于组件公共契约的关键交互
- **THEN** 对应契约仍由适用的单元、集成或 E2E 测试独立验证
