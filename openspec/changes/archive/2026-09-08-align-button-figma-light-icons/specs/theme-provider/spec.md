## MODIFIED Requirements

### Requirement: 无主题提供者时组件独立可用

公共组件 MUST 在仅加载自身所需公共样式且没有 `SThemeProvider` 时使用默认浅色主题，无需额外加载共享 token CSS。Button 默认主题 MUST 对齐 button-component 的 Figma 浅色契约，图标 SHALL 无需独立 CSS。

#### Scenario: 单独使用按钮

- **WHEN** 使用者加载 Button 与其样式并直接渲染按钮
- **THEN** 按钮具有新的 Figma 默认外观及各 Props 对应状态样式，不依赖全局主题初始化

### Requirement: 主题预设与覆盖具有确定的优先级

组件库 MUST 仅提供类型化的内置浅色预设，以及共享 token 和组件覆盖类型，不再提供内置暗色预设。错误语义公共字段 MUST 使用 Error 命名，不保留 Danger 别名。主题基础 MUST 优先选择显式 `preset`，否则在允许继承且存在父主题时采用父主题，否则采用默认主题；当前 `tokens` MUST 最后覆盖。显式预设或 `inherit=false` MUST 清除父级共享覆盖及组件覆盖的影响。组件 token MUST 在共享 token 合并后解析，组件覆盖优先于对应默认派生值。输入中的未定义字段 MUST 不覆盖已有值，输入对象 MUST 不被修改；`null` 不属于这些输入的公共类型。自定义预设能力 SHALL 保留，不限制消费端自行选色。

#### Scenario: 内层只调整主色

- **WHEN** 外层使用浅色自定义预设，内层仅提供主色覆盖
- **THEN** 内层使用新主色并保留外层其他值，外层和兄弟区域不受影响

#### Scenario: 内层重置继承

- **WHEN** 外层有自定义共享及 Button 覆盖，内层设置 `inherit=false` 或显式浅色预设
- **THEN** 内层从默认主题或显式预设重新解析，不残留父级覆盖

#### Scenario: 移除覆盖

- **WHEN** 使用者更新主题输入并移除先前覆盖字段
- **THEN** 对应外观恢复为当前基础主题值，不保留旧覆盖，原输入对象保持不变

### Requirement: 主题渲染支持服务端隔离

主题解析 MUST 不要求浏览器 DOM，服务端渲染 MUST 输出当前主题所需的组件样式变量，且不同渲染请求的主题 MUST 相互隔离。在服务端和客户端输入相同时，初始主题 MUST 一致。

#### Scenario: 连续渲染不同主题

- **WHEN** 服务端先后渲染自定义浅色和默认主题的组件树
- **THEN** 各输出携带各自主题值，默认主题不受前一次渲染污染
