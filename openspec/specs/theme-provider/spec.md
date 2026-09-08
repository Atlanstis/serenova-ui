# theme-provider Specification

## Purpose

定义 Serenova UI 组件的默认主题、可选主题提供者、共享令牌与组件覆盖的公共行为，保证组件独立使用、局部嵌套、多主题并存以及跨 DOM 渲染位置时具有一致且可验证的主题结果。

## Requirements

### Requirement: 无主题提供者时组件独立可用

公共组件 MUST 在仅加载自身公共样式且没有 `SThemeProvider` 时使用默认浅色主题，无需额外加载共享 token CSS。默认主题 MUST 保留现有 Button 的尺寸、颜色和交互状态外观。

#### Scenario: 单独使用按钮

- **WHEN** 使用者加载 Button 与其样式并直接渲染按钮
- **THEN** 按钮具有完整默认外观及各 Props 对应状态样式，不依赖全局主题初始化

### Requirement: 主题提供者不改变布局或交互

`SThemeProvider` MUST 支持可选的 `preset`、`tokens`、`inherit` 输入以及默认插槽，`inherit` 默认值为 `true`。提供者 MUST 不新增 DOM 容器、可聚焦元素、业务事件或鼠标键盘处理，MUST 保持插槽的顺序与原有交互行为。

#### Scenario: 包裹多个插槽子项

- **WHEN** 使用者将多个组件放入主题提供者默认插槽
- **THEN** 页面不增加布局包装元素，插槽子项保持顺序，按钮鼠标与键盘操作继续产生原有业务结果

### Requirement: 主题预设与覆盖具有确定的优先级

组件库 MUST 提供类型化的默认浅色与暗色预设，以及共享 token 和组件覆盖类型。主题基础 MUST 优先选择显式 `preset`，否则在允许继承且存在父主题时采用父主题，否则采用默认主题；当前 `tokens` MUST 最后覆盖。显式预设或 `inherit=false` MUST 清除父级共享覆盖及组件覆盖的影响。组件 token MUST 在共享 token 合并后解析，组件覆盖优先于对应默认派生值。输入中的未定义字段 MUST 不覆盖已有值，输入对象 MUST 不被修改；`null` 不属于这些输入的公共类型。

#### Scenario: 内层只调整主色

- **WHEN** 外层使用暗色预设，内层仅提供主色覆盖
- **THEN** 内层使用新主色并保留暗色主题其他值，外层和兄弟区域不受影响

#### Scenario: 内层重置继承

- **WHEN** 外层有暗色及 Button 覆盖，内层设置 `inherit=false` 或显式浅色预设
- **THEN** 内层从默认主题或显式预设重新解析，不残留父级覆盖

#### Scenario: 移除覆盖

- **WHEN** 使用者更新主题输入并移除先前的覆盖字段
- **THEN** 对应外观恢复为当前基础主题值，不保留旧覆盖，原输入对象保持不变

### Requirement: 主题更新与跨位置渲染保持一致

主题归属 MUST 按 Vue 组件上下文确定，主题更新 MUST 响应式地反映到所属组件，无需重新挂载。组件经 Teleport 渲染到其他 DOM 位置时 MUST 保持原主题归属。独立创建且未连接主题上下文的组件 MUST 使用默认主题。

#### Scenario: 同页切换局部主题

- **WHEN** 两个独立提供者并存且只更新其中一个的预设
- **THEN** 仅其所属组件更新外观，组件交互状态保持不变

#### Scenario: 按钮传送到页面外部容器

- **WHEN** Provider 下的 Button 经 Teleport 渲染到 `body` 并切换主题
- **THEN** 按钮外观与原 Provider 内的按钮保持一致，不采用目标容器所属的其他主题上下文

### Requirement: 主题渲染支持服务端隔离

主题解析 MUST 不要求浏览器 DOM，服务端渲染 MUST 输出当前主题所需的组件样式变量，且不同渲染请求的主题 MUST 相互隔离。在服务端和客户端输入相同时，初始主题 MUST 一致。

#### Scenario: 连续渲染不同主题

- **WHEN** 服务端先后渲染暗色和默认主题的组件树
- **THEN** 各输出携带各自主题值，默认主题不受前一次渲染污染
