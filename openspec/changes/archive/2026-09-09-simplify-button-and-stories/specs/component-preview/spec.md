## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Button 展示参数与实际交互一致

Button Story SHALL 仅显示实际影响该示例的可编辑 Controls；固定矩阵的比较维度 MUST 不显示无效调节项。基础用法 SHALL 支持文案和图标组合调试，开启纯图标时 MUST 提供可见图标。展示辅助输入 MUST 不成为 SButton 的公共 Props。交互反馈 SHALL 支持鼠标、Enter、Space 经同一按钮激活路径观察计数与业务事件；禁用和加载时 MUST 不增加计数。调试用 play SHALL 可重复执行，且 MUST 不因允许调节的禁用或加载状态而错误期待成功点击。

#### Scenario: 调试纯图标

- **WHEN** 维护者在基础用法中开启 iconOnly
- **THEN** 按钮显示业务图标或加载图标，不因示例缺少 icon 插槽而呈现空白

#### Scenario: 调节展示参数

- **WHEN** 维护者编辑某个 Story 中显示的 Control
- **THEN** 对应渲染或业务行为随之变化，固定比较维度不提供无效 Control，block 不再出现在参数说明中

#### Scenario: 观察多种激活方式

- **WHEN** 维护者使用鼠标、Enter 或 Space 激活交互示例中的可用按钮
- **THEN** 每次激活均增加一次计数并发出一次业务事件，焦点与波纹可通过真实交互观察

#### Scenario: 重复调试或切换不可用状态

- **WHEN** 维护者重复运行 play，或在允许调节的范围内设置 disabled 或 loading
- **THEN** 调试以本次激活前的结果为基准，或从确定初始状态开始；不可用时计数不增加，不执行无条件成功点击断言
