# component-preview Specification

## Purpose

定义基于 Storybook 的组件开发工作台，使维护者能够快速调试源码、复现交互并查阅组件文档，同时与自动化组件测试和发布质量门槛保持职责分离。

## Requirements

### Requirement: 提供源码 HMR 预览

Storybook SHALL 仅作为开发过程中的源码预览工作台，通过包公共名称解析到组件库源码，并 MUST 在组件或样式修改后提供热更新反馈；仓库 MUST 提供单一、明确的开发命令启动该工作台。

#### Scenario: 修改 Button 源码

- **WHEN** 维护者启动 Storybook 开发预览并修改 `SButton` 的模板、逻辑或样式
- **THEN** 当前 Story 通过源码热更新显示结果

#### Scenario: 启动开发预览

- **WHEN** 维护者需要浏览组件文档或调试 Story 交互
- **THEN** 维护者通过唯一的开发预览入口启动源码 Storybook

### Requirement: Story 使用真实消费方式

所有组件 Story 及其 Vue 示例 MUST 从 `serenova-ui` 公共入口导入组件，组件样式自动加载。Story 配置和示例 SHALL 仅参与开发工作台类型检查，组件库类型检查和发布构建 SHALL 以公共库源码为范围，发布产物 SHALL 仅包含库运行时代码及其类型。

#### Scenario: 新增组件 Story

- **WHEN** 维护者为公共组件新增 Story
- **THEN** Story 通过公共 API 使用组件，Story 及其示例和 Storybook 配置仅用于开发工作台

#### Scenario: 默认预览自动加载样式

- **WHEN** 启动使用组件自动样式加载机制的源码 Storybook
- **THEN** 组件外观正常，修改 SFC 样式继续触发热更新

#### Scenario: 检查示例类型与发布边界

- **WHEN** 执行 Storybook 类型检查和组件库构建
- **THEN** 示例参与 Storybook 类型检查，生成的库 JS 和类型声明均保持开发示例隔离

### Requirement: 提供组件工作台能力

Storybook SHALL 自动发现组件 Story，并 SHALL 提供 Docs、Controls、Actions 和 Viewport 能力；关键交互 SHALL 可通过 Story 的 `play` 函数复现和调试。组件库 E2E 和完整质量门槛 SHALL 采用独立的自动化测试流程。

#### Scenario: 调节 Button Props 并观察事件

- **WHEN** 维护者在组件 Story 中修改公共 Props 并触发交互
- **THEN** Canvas 按参数重新渲染，且 Actions 或供调试使用的 `play` 函数能够观察公共事件

#### Scenario: 查阅组件说明

- **WHEN** 维护者打开组件 Docs 页面
- **THEN** Storybook 基于组件元数据和 Story 展示公共参数、示例与交互说明

#### Scenario: 执行完整质量检查

- **WHEN** 仓库运行自动化完整质量入口
- **THEN** 流程通过类型检查、单元测试、真实浏览器集成测试、消费应用 E2E、构建和发布契约测试判定组件库是否可发布

### Requirement: Storybook 与自动化测试职责分离

Storybook SHALL 仅作为开发预览、交互调试和组件文档工作台。组件公共行为 MUST 由单元测试、适用的真实浏览器集成测试或消费应用 E2E 验证，Story 的存在与手工可用性 SHALL 仅作为开发调试信息。

#### Scenario: Storybook 环境发生故障

- **WHEN** Storybook 的开发环境、主题装饰器或调试用 `play` 函数发生故障
- **THEN** 该问题作为开发工作台问题处理，消费应用 E2E 专注于组件库构建产物的消费流程

#### Scenario: Story 展示关键交互

- **WHEN** Story 展示一个属于组件公共契约的关键交互
- **THEN** 对应契约仍由适用的单元、集成或 E2E 测试独立验证

### Requirement: 覆盖 Button 关键状态

Storybook SHALL 在 Docs 顶部提供参数调试，并在下方按类型与外观、尺寸、禁用与加载、图标插槽、纯图标按钮、文字按钮、点击与键盘交互、局部主题覆盖八个主题组织 Button。展示 SHALL 覆盖四种语义 variant、独立 text 属性、Ghost、三档尺寸、插槽、事件、键盘焦点与点击反馈。工作台 SHALL 支持浅色自定义覆盖、RTL 与常见视口；主题范围 SHALL 为浅色预设及其自定义覆盖，原生表单契约 SHALL 由独立自动化测试验证。

#### Scenario: 检查 Button 状态矩阵

- **WHEN** 使用者打开 Button Docs
- **THEN** 顶部看到可交互的参数调试和 Controls，下方按上述顺序展示八个用法主题；侧边栏与下方列表仅呈现八个独立用法，参数调试仅在 Docs 顶部展示

#### Scenario: 检查不同显示环境

- **WHEN** 维护者调整浅色覆盖、RTL 或预览视口
- **THEN** Button Story 在所选环境中重新呈现，主题选项限定为浅色预设及其自定义覆盖

#### Scenario: 比较类型与尺寸

- **WHEN** 维护者查看类型与外观、尺寸主题
- **THEN** 四种语义类型提供默认、Ghost 和 Text 对照，text 与 ghost 组合呈现文字外观；三档尺寸采用相同文案并标注默认高度 28、34、40 px

#### Scenario: 查看加载与图标组合

- **WHEN** 使用者查看禁用与加载、图标插槽及纯图标按钮主题
- **THEN** 可查看代表性的禁用、加载和 Ghost 加载状态，操作一个可恢复的加载示例；可查看前置、后置、双图标及加载时图标变化，以及纯图标三档尺寸、Ghost、禁用和加载状态

#### Scenario: 查阅文字按钮

- **WHEN** 使用者查看文字按钮主题
- **THEN** 可查看四种语义类型的文字按钮、禁用、加载、text 与 ghost 组合，以及通过容器间距排列的编辑、查看详情、删除操作；可实际观察悬停下划线、键盘焦点及无点击波纹的行为

#### Scenario: 查阅局部主题覆盖

- **WHEN** 使用者查看局部主题覆盖主题
- **THEN** 可对照默认主色按钮和提供者内自定义主色按钮，并通过该示例源码了解完整接入方式

### Requirement: Storybook 配置保持轻量职责

`.storybook` 配置 SHALL 只负责框架集成、Story 发现和全局预览环境；公共组件实现 SHALL 由组件源码负责，业务状态 SHALL 归属于相应消费场景。

#### Scenario: 扩展新的组件分类

- **WHEN** 仓库增加新的组件及其 Story
- **THEN** Storybook 自动发现对应分类与示例，分类导航由 Story 元数据生成，示例复用公共组件实现

### Requirement: Button 展示参数与实际交互一致

Button Story SHALL 仅显示实际影响该示例的可编辑 Controls；固定示例 SHALL 以只读展示呈现。参数调试 SHALL 支持公共 Props、文案和无图标、前置、后置、双图标选择，开启纯图标时 MUST 提供可见图标。展示辅助输入 SHALL 仅属于示例和 Story 接入层，公共组件 SHALL 仅接收其公共参数。点击与键盘交互 SHALL 支持鼠标、Enter、Space 经同一按钮激活路径观察计数与业务事件，并 SHALL 允许调节 text、ghost、variant、size、disabled 和 loading。禁用和加载时 MUST 保持计数原值。调试用 play SHALL 可重复执行，并 MUST 按当前禁用或加载状态检查对应结果。

#### Scenario: 调试纯图标

- **WHEN** 维护者在参数调试中开启 iconOnly
- **THEN** 按钮显示业务图标或加载图标

#### Scenario: 恢复无图标

- **WHEN** 使用者选择一种图标组合后切回无图标
- **THEN** 普通按钮恢复仅文案展示，图标组合可在所有有效选项之间反复切换

#### Scenario: 调节展示参数

- **WHEN** 维护者编辑某个 Story 中显示的 Control
- **THEN** 对应渲染或业务行为随之变化，固定比较维度以只读方式展示，参数说明仅包含当前公共 Props 和有效的展示辅助输入

#### Scenario: 观察多种激活方式

- **WHEN** 维护者使用鼠标、Enter 或 Space 激活交互示例中的可用按钮
- **THEN** 每次激活均增加一次计数并发出一次业务事件，焦点与波纹可通过真实交互观察

#### Scenario: 重复调试或切换不可用状态

- **WHEN** 维护者重复运行 play，或在允许调节的范围内设置 disabled 或 loading
- **THEN** 调试以本次激活前的结果为基准，或从确定初始状态开始；禁用或加载时检查原生禁用状态及计数和事件次数保持原值

#### Scenario: 展示外观与交互参数

- **WHEN** 维护者查看 Button Docs、参数表和参数调试配置
- **THEN** 参数表与调试配置仅覆盖当前公共 Props 和有效的展示辅助输入，原生 type 透传与表单契约由组件规格和独立自动化测试说明与验证

### Requirement: 当前预览分类范围

当前工作台 SHALL 仅提供 Button 分类，图标与主题提供者 SHALL 作为 Button 组合示例的公共依赖使用。开发入口 MUST 保持 `dev`，Button Docs 标识 MUST 保持 `components-button--docs`。

#### Scenario: 浏览开发工作台

- **WHEN** 使用者运行 dev 并打开 Button Docs
- **THEN** 分类导航仅包含 Button，图标和局部主题示例正常呈现

### Requirement: 完整示例源码展示

每条 Story MUST 对应一个真实 Vue 单文件示例，预览与 Show code MUST 使用同一文件。Show code SHALL 完整显示文件中的导入、逻辑、模板、注释及存在的样式；必要的示例布局 SHALL 在文件内表达。示例 SHALL 通过公共入口消费组件，具有可独立使用的默认状态。

#### Scenario: 展开示例代码

- **WHEN** 使用者展开任一 Button Story 的 Show code
- **THEN** 代码区显示该预览对应的完整 Vue 示例源码，包含所需的局部布局样式与逻辑

#### Scenario: 调节参数后查看代码

- **WHEN** 使用者通过 Controls 调整示例参数
- **THEN** 预览响应参数变化，代码区继续显示文件原文及其参数声明和绑定

#### Scenario: 修改示例文件

- **WHEN** 维护者在 dev 运行期间修改示例逻辑、模板或样式
- **THEN** 预览和 Show code 均通过热更新反映同一文件的最新内容
