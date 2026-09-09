# button-component Specification

## Purpose

定义 Serenova UI 首个公共基础组件 `SButton` 的稳定使用契约，覆盖外观状态、插槽、事件、原生按钮行为和属性透传。

## Requirements

### Requirement: 提供稳定的 Button 外观 API

`SButton` SHALL 支持 `variant`、`size`、`disabled`、`loading`、`nativeType`、`ghost` 和 `iconOnly`。`variant` MUST 仅支持 `primary / warning / success / error / text`，默认 `primary`，不保留 `default` 或 `danger` 别名；默认尺寸 SHALL 为 `medium`、原生类型 SHALL 为 `button`，所有布尔 Props SHALL 默认为 `false`。`ghost` SHALL 对四种语义类型提供透明底描边外观，在 `text` 下不改变文字按钮外观。`iconOnly` SHALL 在默认布局下保持所选尺寸的正方形。`block` MUST 不再属于公共 Props，组件 SHALL 不再提供内置满宽模式；消费端可通过 class/style 设置普通按钮宽度。

#### Scenario: 使用默认配置渲染

- **WHEN** 使用者不传入 Props 渲染按钮
- **THEN** 按钮使用 primary、medium，并渲染为 `type="button"` 的原生按钮

#### Scenario: 渲染块级按钮

- **WHEN** 消费端检查 ButtonProps 并通过 style 为普通按钮设置宽度
- **THEN** ButtonProps 不包含 block，按钮保留宽度样式透传能力，不提供 block 兼容别名

#### Scenario: 组合外观属性

- **WHEN** 使用者分别组合 `variant="error"` 与 `ghost=true`、`variant="text"` 与 `ghost=true`
- **THEN** 前者显示错误语义描边按钮，后者保持文字按钮外观

#### Scenario: 移除旧变体

- **WHEN** 消费端使用公共类型或变体常量
- **THEN** 仅包含五个新变体，`default` 和 `danger` 不再是有效类型值

### Requirement: 支持内容与图标插槽

`SButton` MUST 提供默认内容插槽、前置 `icon` 插槽和后置 `suffixIcon` 插槽。图标默认不显示；非加载普通按钮 SHALL 按前图标、文字、后图标顺序渲染，支持任意位置单独提供以及前后同时提供。图标默认显示为 16×16 px 并继承当前文字颜色，缺省插槽 MUST 不占位。`iconOnly=true` SHALL 仅使用 `icon` 插槽，隐藏默认和后置插槽，去除文字按钮最小宽度及水平内边距，保持所选尺寸正方形。

#### Scenario: 渲染前后图标

- **WHEN** 使用者同时提供三个插槽
- **THEN** 按前图标、文字、后图标顺序显示，内容间距为 8 px

#### Scenario: 渲染文本和图标

- **WHEN** 使用者同时提供默认插槽和前置图标插槽
- **THEN** 按照图标在前、文本在后的顺序显示内容

#### Scenario: 仅提供后图标

- **WHEN** 普通按钮只提供默认和后置插槽
- **THEN** 显示文字和后图标，前方没有空图标位置

#### Scenario: 渲染纯图标按钮

- **WHEN** `iconOnly=true`，提供前置图标，并设置任意支持的尺寸
- **THEN** 仅显示前置图标，按钮宽高均为所选尺寸的 28、34 或 40 px

### Requirement: 提供可预测的点击行为

`SButton` SHALL 在可用状态下发出恰好一次携带原生 `MouseEvent` 的 `click`，鼠标与 Enter、Space MUST 沿用同一原生按钮激活路径。`disabled` 或 `loading` MUST 使用原生禁用行为，阻止业务点击和波纹。加载时 MUST 使用当前类型禁用配色，Ghost 保留透明背景；普通按钮 MUST 隐藏前后业务图标，显示单个 16 px Loading 图标并保留原有文字；纯图标按钮 MUST 以 Loading 替换图标并保持尺寸。加载图标 SHALL 以 800 ms 线性周期旋转，退出加载后恢复业务内容，不自动改写文案。

#### Scenario: 鼠标与键盘激活

- **WHEN** 用户点击按钮，或聚焦后分别使用 Enter、Space 激活
- **THEN** 每次激活产生相同业务结果且仅发出一次 click，可用按钮保持原生焦点行为

#### Scenario: 可用按钮被点击

- **WHEN** 用户点击未禁用且未加载的按钮
- **THEN** 恰好发出一次携带原生 MouseEvent 的 click

#### Scenario: 禁用按钮被点击

- **WHEN** `disabled=true`、`loading=false` 且用户尝试激活按钮
- **THEN** 按钮不可交互，不发出 click，不触发波纹，也不显示加载图标

#### Scenario: 加载按钮被点击

- **WHEN** `loading=true` 且用户尝试激活按钮
- **THEN** 按钮显示加载图标和禁用配色，不重复触发操作或波纹

#### Scenario: 前后图标进入及退出加载

- **WHEN** 带文字与前后图标的按钮切换 loading
- **THEN** 加载时仅保留单个 Loading 与原文字，退出后恢复原前后图标

### Requirement: 保留原生按钮与表单语义

`SButton` MUST 使用原生按钮元素，并 SHALL 将 `nativeType` 映射为原生 `type`，同时透传适用的 `data-*`、`form`、`name`、class 和 style 属性。

#### Scenario: 提交表单

- **WHEN** 位于表单中的 `SButton` 设置 `nativeType="submit"` 并被激活
- **THEN** 按钮触发浏览器原生表单提交语义

#### Scenario: 透传业务属性

- **WHEN** 使用者传入表单归属、名称、数据标记、class 或 style
- **THEN** 最终原生按钮保留对应属性

### Requirement: 默认浅色外观对齐 Figma

无自定义主题覆盖时，Button MUST 对齐 Figma 已读取的浅色设计。small/medium/large 高度 SHALL 为 28/34/40 px；四种语义普通按钮最小宽度 SHALL 为 64/80/96 px，水平内边距 SHALL 为 12/16/20 px，文字按钮不强制语义按钮最小宽度。圆角 SHALL 为 6 px，字号 SHALL 为 14 px、字重 500、行高 20 px。颜色 SHALL 使用下表；禁用及加载 MUST 使用独立配色而非整体透明度衰减。文字按钮默认使用 `#6d28d9`，Hover/Pressed 显示下划线，禁用使用 `#a48cbf`。

| 类型    | 默认    | Hover   | Pressed | 实心禁用背景 |
| ------- | ------- | ------- | ------- | ------------ |
| primary | #7c3aed | #6d28d9 | #5b21b6 | #aa92cd      |
| warning | #f0b429 | #dea41d | #c58e12 | #dfc58b      |
| success | #34b27b | #299f6c | #21885c | #93cbb2      |
| error   | #f06468 | #df5359 | #c9444b | #e6abae      |

实心文字 SHALL 为白色；Ghost SHALL 使用透明底、1 px 同类型描边与文字，primary Ghost 默认采用 accent `#6d28d9`；Ghost 加载采用对应禁用色描边及图标。键盘焦点 MUST 有 2 px 类型对应外环，primary/text 采用 `#9672d0`，其余采用对应语义默认色，不改变布局尺寸。

#### Scenario: 比较三档尺寸

- **WHEN** 默认主题下分别渲染三档普通语义按钮和纯图标按钮
- **THEN** 高度、最小宽度、字体和图标尺寸符合上述约定，纯图标按其专用正方形规则显示

#### Scenario: 检查禁用外观

- **WHEN** 实心 error 按钮进入 disabled 或 loading
- **THEN** 背景为 `#e6abae`，文字保持白色，不以整体 0.55 透明度替代配色

#### Scenario: 检查键盘焦点

- **WHEN** 用户通过 Tab 聚焦可用按钮
- **THEN** 出现类型对应焦点外环，尺寸和邻近布局不变

### Requirement: 提供类型一致的点击波纹

四种语义按钮的实心、Ghost 和纯图标形态 MUST 在有效激活后显示同类型外环，600 ms 内向外扩散 5 px 并淡出，随后复位；文字按钮 SHALL 不产生此波纹。连续激活 SHALL 重启当前波纹，不累积永久节点或阻塞 click。禁用或加载切换 MUST 终止正在播放的波纹。

#### Scenario: 鼠标及键盘触发波纹

- **WHEN** 用户用鼠标或键盘激活同一可用语义按钮
- **THEN** 两种输入均产生同类型外环反馈，完成后恢复初始状态

#### Scenario: 动画中切换禁用状态

- **WHEN** 波纹播放时进入 disabled 或 loading
- **THEN** 波纹被清理，后续激活不产生新波纹
