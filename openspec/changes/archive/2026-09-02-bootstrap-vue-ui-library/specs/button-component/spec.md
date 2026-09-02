## Purpose

定义 Serenova UI 首个公共基础组件 `SButton` 的稳定使用契约，覆盖外观状态、插槽、事件、原生按钮行为和属性透传。

## ADDED Requirements

### Requirement: 提供稳定的 Button 外观 API

`SButton` SHALL 支持 `variant`、`size`、`block`、`disabled`、`loading` 和 `nativeType` Props，其中默认视觉变体 SHALL 为 `default`、默认尺寸 SHALL 为 `medium`、默认原生类型 SHALL 为 `button`。

#### Scenario: 使用默认配置渲染

- **WHEN** 使用者在不传入 Props 的情况下渲染 `SButton`
- **THEN** 组件显示默认视觉变体和中等尺寸，并渲染为 `type="button"` 的原生按钮

#### Scenario: 渲染块级按钮

- **WHEN** 使用者设置 `block` 为 `true`
- **THEN** 按钮占用其容器的可用行宽

### Requirement: 支持内容与图标插槽

`SButton` MUST 提供默认内容插槽和可选图标插槽，并 SHALL 在图标存在或不存在时保持可理解的内容顺序。

#### Scenario: 渲染文本和图标

- **WHEN** 使用者同时提供默认插槽和图标插槽
- **THEN** 按钮按照图标在前、文本在后的顺序显示内容

### Requirement: 提供可预测的点击行为

`SButton` SHALL 在可用状态下向使用者发出携带原生 `MouseEvent` 的 `click` 事件，并 MUST 在 `disabled` 或 `loading` 状态下阻止该公共点击事件。

#### Scenario: 可用按钮被点击

- **WHEN** 使用者点击未禁用且未加载的按钮
- **THEN** 组件恰好发出一次 `click` 事件并提供原生鼠标事件

#### Scenario: 禁用按钮被点击

- **WHEN** `disabled` 为 `true` 且用户尝试点击按钮
- **THEN** 按钮不可交互且组件不发出 `click` 事件

#### Scenario: 加载按钮被点击

- **WHEN** `loading` 为 `true` 且用户尝试点击按钮
- **THEN** 按钮显示加载状态、不可重复触发操作且组件不发出 `click` 事件

### Requirement: 保留原生按钮与表单语义

`SButton` MUST 使用原生按钮元素，并 SHALL 将 `nativeType` 映射为原生 `type`，同时透传适用的 `data-*`、`form`、`name`、class 和 style 属性。

#### Scenario: 提交表单

- **WHEN** 位于表单中的 `SButton` 设置 `nativeType="submit"` 并被激活
- **THEN** 按钮触发浏览器原生表单提交语义

#### Scenario: 透传业务属性

- **WHEN** 使用者传入表单归属、名称、数据标记、class 或 style
- **THEN** 最终原生按钮保留对应属性
