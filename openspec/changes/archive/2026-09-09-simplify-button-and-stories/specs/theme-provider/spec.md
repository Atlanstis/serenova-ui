## MODIFIED Requirements

### Requirement: 主题预设与覆盖具有确定的优先级

组件库 MUST 仅提供类型化的内置浅色预设，以及共享 token 和组件覆盖类型，不再提供内置暗色预设。错误语义公共字段 MUST 使用 Error 命名，不保留 Danger 别名。主题基础 MUST 优先选择显式 `preset`，否则在允许继承且存在父主题时采用父主题，否则采用默认主题；当前 `tokens` MUST 最后覆盖。显式预设或 `inherit=false` MUST 清除父级共享覆盖及组件覆盖的影响。组件 token MUST 在共享 token 合并后解析，组件覆盖优先于对应默认派生值。输入中的未定义字段 MUST 不覆盖已有值，输入对象 MUST 不被修改；`null` 不属于这些输入的公共类型。自定义预设能力 SHALL 保留，不限制消费端自行选色。Button 的公共主题覆盖类型 MUST 不包含 `ghostColorText`；文字按钮的正常文字颜色 SHALL 继续由 `textColorText` 覆盖，四种语义按钮的 Ghost 配色覆盖 SHALL 保留。

#### Scenario: 内层只调整主色

- **WHEN** 外层使用浅色自定义预设，内层仅提供主色覆盖
- **THEN** 内层使用新主色并保留外层其他值，外层和兄弟区域不受影响

#### Scenario: 内层重置继承

- **WHEN** 外层有自定义共享及 Button 覆盖，内层设置 `inherit=false` 或显式浅色预设
- **THEN** 内层从默认主题或显式预设重新解析，不残留父级覆盖

#### Scenario: 移除覆盖

- **WHEN** 使用者更新主题输入并移除先前覆盖字段
- **THEN** 对应外观恢复为当前基础主题值，不保留旧覆盖，原输入对象保持不变

#### Scenario: 使用有效的 Button 主题字段

- **WHEN** 消费端检查 Button 主题覆盖类型，并分别覆盖文字按钮颜色与语义 Ghost 颜色
- **THEN** ghostColorText 不是有效公共字段，textColorText 和四种语义 Ghost 颜色字段仍可改变对应外观
