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

Storybook SHALL 将 `SButton` 展示组织为基础用法、类型与外观、尺寸、禁用与加载、图标用法、交互反馈六个主题，覆盖五种变体、三档尺寸、Ghost、前后图标、纯图标、事件、键盘焦点及点击波纹，并 SHALL 支持检查浅色自定义覆盖、RTL 与常见视口。工作台 MUST 不提供内置 dark 切换及暗色示例。Button 展示 MUST 移除 Form Story、表单交互示例和块级布局展示；组件的原生表单契约与自动化验证 SHALL 保留。

#### Scenario: 检查 Button 状态矩阵

- **WHEN** 维护者打开 Button 预览
- **THEN** 可以按六个主题查看 Figma 对应状态及图标组合，并观察业务事件及反馈，不存在独立 Form 或块级布局展示

#### Scenario: 检查不同显示环境

- **WHEN** 维护者调整浅色覆盖、RTL 或预览视口
- **THEN** Button Story 在所选环境中重新呈现，无需修改组件源码，且不存在内置暗色切换选项

#### Scenario: 比较类型与尺寸

- **WHEN** 维护者查看类型与外观、尺寸主题
- **THEN** 五种变体具有清楚的标签，四种语义类型提供 Ghost 对照，Text Ghost 标注不适用；三档尺寸采用相同按钮文案并标注 28、34、40 px

#### Scenario: 查看加载与图标组合

- **WHEN** 维护者查看禁用与加载、图标用法主题
- **THEN** 可比较五种类型的禁用与普通加载、四种语义类型的 Ghost 加载，查看前置、后置、双图标、纯图标和非加载 Ghost 纯图标，以及纯图标三档尺寸、禁用与加载的代表性示例

### Requirement: Storybook 配置保持轻量职责

`.storybook` 配置 SHALL 只负责框架集成、Story 发现和全局预览环境，不得承载公共组件实现或与 Story 无关的业务状态。

#### Scenario: 扩展新的组件分类

- **WHEN** 仓库增加新的组件及其 Story
- **THEN** Storybook 自动发现对应分类与示例，不需要修改自建导航或复制组件实现逻辑

### Requirement: 展示独立图标组件

Storybook SHALL 从包根公共入口展示六个图标组件，说明 size、color、颜色继承和 Button 插槽使用，文档 SHALL 说明包根与 icons 两种公共导入方式，不展示单图标子路径。图标预览 SHALL 遵循现有工作台职责，不代替自动化测试。

#### Scenario: 查阅图标用法

- **WHEN** 使用者打开图标 Docs
- **THEN** 能查看六个真实图形、调整尺寸颜色，并找到独立使用和按钮组合示例

### Requirement: Button 展示参数与实际交互一致

Button Story SHALL 仅显示实际影响该示例的可编辑 Controls；固定矩阵的比较维度 MUST 不显示无效调节项。基础用法 SHALL 支持文案和图标组合调试，开启纯图标时 MUST 提供可见图标。展示辅助输入 MUST 不成为 SButton 的公共 Props。交互反馈 SHALL 支持鼠标、Enter、Space 经同一按钮激活路径观察计数与业务事件；禁用和加载时 MUST 不增加计数。调试用 play SHALL 可重复执行，且 MUST 不因允许调节的禁用或加载状态而错误期待成功点击。

#### Scenario: 调试纯图标

- **WHEN** 维护者在基础用法中开启 iconOnly
- **THEN** 按钮显示业务图标或加载图标，不因示例缺少 icon 插槽而呈现空白

#### Scenario: 调节展示参数

- **WHEN** 维护者编辑某个 Story 中显示的 Control
- **THEN** 对应渲染或业务行为随之变化，固定比较维度不提供无效 Control，block 和 nativeType 不再出现在参数说明中

#### Scenario: 观察多种激活方式

- **WHEN** 维护者使用鼠标、Enter 或 Space 激活交互示例中的可用按钮
- **THEN** 每次激活均增加一次计数并发出一次业务事件，焦点与波纹可通过真实交互观察

#### Scenario: 重复调试或切换不可用状态

- **WHEN** 维护者重复运行 play，或在允许调节的范围内设置 disabled 或 loading
- **THEN** 调试以本次激活前的结果为基准，或从确定初始状态开始；不可用时计数不增加，不执行无条件成功点击断言

#### Scenario: 移除原生类型专用展示参数

- **WHEN** 维护者查看 Button Docs、参数表和基础用法配置
- **THEN** 不再出现 nativeType 的属性说明、参数定义和默认值，Story 不再向组件传递 nativeType，也不新增替代的 type Control 或 Form Story
