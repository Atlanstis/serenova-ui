## MODIFIED Requirements

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
