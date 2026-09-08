## MODIFIED Requirements

### Requirement: 支持组件与主题的独立公共子路径

组件库 MUST 提供 `serenova-ui/button`、`serenova-ui/theme-provider`、`serenova-ui/icons` 的 ESM、CommonJS 与类型入口，以及 `serenova-ui/button/style.css`。MUST 提供 `serenova-ui/themes/light` 的预设及对应类型入口，MUST NOT 提供 `serenova-ui/themes/dark`。六个图标及 `IconProps` MUST 同时从包根和 icons 集合入口具名导出；MUST NOT 提供 `serenova-ui/icons/add` 等单图标子路径或通配导出。无视觉规则的主题提供者和内联图标 SHALL 不要求独立 CSS。包根组件、插件及 Provider 公共类型 MUST 保留，默认插件 SHALL 注册六个图标，每个图标 SHALL 支持单组件 app.use 安装。

#### Scenario: 按需消费按钮

- **WHEN** 消费应用导入 `serenova-ui/button` 和 `serenova-ui/button/style.css`
- **THEN** 应用可使用完整默认按钮及加载图标，无需导入全量 CSS 或主题提供者

#### Scenario: 按需消费浅色预设

- **WHEN** 消费应用导入主题提供者及浅色预设
- **THEN** 公共导出和声明可解析，预设不引入未使用组件实现或结构样式

#### Scenario: 按需消费暗色预设

- **WHEN** 旧消费应用尝试从 `serenova-ui/themes/dark` 导入暗色预设
- **THEN** 该路径不再公开，使用者按迁移说明切换浅色预设或自定义 Provider 配置

#### Scenario: 从集合入口消费一个图标

- **WHEN** 消费应用从 `serenova-ui/icons` 具名导入 SIconAdd 并进行支持 tree shaking 的 ESM 生产构建
- **THEN** 图标可使用且产物不包含其他未使用图标、Button、Provider 或组件 CSS

#### Scenario: 验证移除的路径

- **WHEN** 消费端尝试解析 themes/dark 或 icons/add 子路径
- **THEN** 包导出映射拒绝这些路径，不提供兼容别名

#### Scenario: 安装图标

- **WHEN** 消费端使用默认插件或对单个图标调用 app.use
- **THEN** 对应图标以约定名称全局注册，具名导入仍可不经安装直接使用

### Requirement: 全量样式保留入口并显式迁移全局主题

`serenova-ui/style.css` MUST 继续提供全量组件样式，但 MUST 不向 `:root` 注入全局主题、改变全页 color-scheme 或响应全局暗色属性。文档 MUST 说明默认 Button 迁移为 Figma primary、danger 改为 error、default 被移除以及内置暗色入口移除；需要自定义颜色的使用者 SHALL 通过保留的 `SThemeProvider` 和 tokens/preset 配置接入。

#### Scenario: 原有默认主题接入

- **WHEN** 使用者沿用包根组件与全量 CSS 导入且未配置主题
- **THEN** Button 使用新的 Figma 浅色 primary 外观，普通页面元素不被全局主题初始化影响

#### Scenario: 迁移暗色主题

- **WHEN** 使用者按迁移文档删除 darkPreset 导入
- **THEN** 可以使用默认浅色主题或自行配置 Provider 颜色，不再依赖内置暗色预设
