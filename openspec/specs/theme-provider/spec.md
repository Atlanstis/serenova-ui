# theme-provider Specification

## Purpose

定义 Serenova UI 组件的默认主题、可选主题提供者、共享令牌与组件覆盖的公共行为，保证组件独立使用、局部嵌套、多主题并存以及跨 DOM 渲染位置时具有一致且可验证的主题结果。

## Requirements

### Requirement: 组件独立使用默认主题

公共组件 MUST 在直接导入并渲染时自动加载基础样式与默认浅色主题，`SThemeProvider` SHALL 作为可选的主题配置入口。Button 默认主题 MUST 对齐 button-component 的 Figma 浅色契约，图标 SHALL 使用自包含的内联 SVG。

#### Scenario: 单独使用按钮

- **WHEN** 使用者仅导入 Button 并在客户端直接渲染按钮
- **THEN** 按钮自动具有 Figma 默认外观及各 Props 对应状态样式

### Requirement: 主题提供者保持插槽布局与交互

`SThemeProvider` MUST 支持可选的 `preset`、`tokens`、`inherit` 输入以及默认插槽，`inherit` 默认值为 `true`。提供者 MUST 直接渲染默认插槽子项，保持其 DOM 层级、顺序、焦点与原有事件及鼠标键盘交互行为。

#### Scenario: 包裹多个插槽子项

- **WHEN** 使用者将多个组件放入主题提供者默认插槽
- **THEN** 页面直接呈现插槽子项并保持其 DOM 层级与顺序，按钮鼠标与键盘操作继续产生原有业务结果

### Requirement: 主题预设与覆盖具有确定的优先级

组件库 MUST 仅提供类型化的内置浅色预设，以及共享 token 和组件覆盖类型。错误语义公共字段 MUST 统一使用 Error 命名。主题基础 MUST 优先选择显式 `preset`，否则在允许继承且存在父主题时采用父主题，否则采用默认主题；当前 `tokens` MUST 最后覆盖。显式预设或 `inherit=false` MUST 清除父级共享覆盖及组件覆盖的影响。组件 token MUST 在共享 token 合并后解析，组件覆盖优先于对应默认派生值。合并 MUST 仅使用已定义的字段值，原输入对象 MUST 保持原值；这些输入 MUST 仅接受对应公共类型的值及表示缺省的 `undefined`。自定义预设 SHALL 支持消费端自行选色。文字按钮的正常文字颜色 SHALL 统一由 `textColorText` 覆盖，Ghost 配色覆盖 SHALL 适用于四种语义按钮。

#### Scenario: 内层只调整主色

- **WHEN** 外层使用浅色自定义预设，内层仅提供主色覆盖
- **THEN** 内层使用新主色并保留外层其他值，外层和兄弟区域保持原有主题

#### Scenario: 内层重置继承

- **WHEN** 外层有自定义共享及 Button 覆盖，内层设置 `inherit=false` 或显式浅色预设
- **THEN** 内层从默认主题或显式预设重新解析，仅采用所选基础主题与当前层覆盖

#### Scenario: 移除覆盖

- **WHEN** 使用者更新主题输入并移除先前覆盖字段
- **THEN** 对应外观恢复为当前基础主题值，原输入对象保持原值

#### Scenario: 使用有效的 Button 主题字段

- **WHEN** 消费端检查 Button 主题覆盖类型，并分别覆盖文字按钮颜色与语义 Ghost 颜色
- **THEN** textColorText 控制文字按钮正常文字颜色，四种语义 Ghost 颜色字段控制对应语义按钮的 Ghost 外观

### Requirement: 主题更新与跨位置渲染保持一致

主题归属 MUST 按 Vue 组件上下文确定，主题更新 MUST 响应式地反映到所属组件，所属组件在当前挂载实例上完成外观更新。组件经 Teleport 渲染到其他 DOM 位置时 MUST 保持原主题归属。独立创建且未连接主题上下文的组件 MUST 使用默认主题。

#### Scenario: 同页切换局部主题

- **WHEN** 两个独立提供者并存且只更新其中一个的预设
- **THEN** 仅其所属组件更新外观，组件保持原有交互状态

#### Scenario: 按钮传送到页面外部容器

- **WHEN** Provider 下的 Button 经 Teleport 渲染到 `body` 并切换主题
- **THEN** 按钮外观与原 Provider 内的按钮保持一致，主题来源始终为原 Vue 组件上下文
