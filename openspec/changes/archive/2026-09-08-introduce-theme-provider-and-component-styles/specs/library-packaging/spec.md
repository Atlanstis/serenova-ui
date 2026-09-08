## ADDED Requirements

### Requirement: 支持组件与主题的独立公共子路径

组件库 MUST 提供 `serenova-ui/button`、`serenova-ui/theme-provider` 的 ESM、CommonJS 与类型入口，以及 `serenova-ui/button/style.css`。MUST 提供 `serenova-ui/themes/light` 和 `serenova-ui/themes/dark` 的预设及对应类型入口。无视觉规则的主题提供者 SHALL 不要求独立 CSS。原包根组件与插件导出 MUST 保留，并增加主题提供者与公共主题类型。

#### Scenario: 按需消费按钮

- **WHEN** 消费应用导入 `serenova-ui/button` 和 `serenova-ui/button/style.css`
- **THEN** 应用可使用完整默认按钮且无需导入全量 CSS 或主题提供者

#### Scenario: 按需消费暗色预设

- **WHEN** 消费应用导入主题提供者及暗色预设
- **THEN** 公共导出和声明可解析，预设不引入未使用组件的实现或结构样式

### Requirement: 样式发布遵循组件依赖边界

每个组件样式入口 MUST 覆盖该组件的全部运行时状态和必要依赖，MUST 不包含无关组件规则、Storybook 样式或全局 reset。全量 CSS MUST 聚合相同来源的组件样式。所有普通 JS 入口 MUST 可在 Node 中直接加载且不隐式加载 CSS；CSS MUST 标记为副作用资源，以免显式导入被构建工具错误删除。

#### Scenario: 验证无关样式排除

- **WHEN** 最小消费构建只使用某一组件，而测试构建中还存在一个无关组件
- **THEN** 产物包含所用组件及必要依赖样式，不包含无关组件规则

#### Scenario: 动态改变按钮状态

- **WHEN** 按需消费的按钮在运行时切换 variant、size 或 loading
- **THEN** 对应样式可用，不依赖消费端扫描或补充 safelist

#### Scenario: Node 消费模块

- **WHEN** Node 通过 ESM 或 CommonJS 加载包根、组件、提供者和预设入口
- **THEN** 加载成功且不需要 CSS loader 或浏览器全局对象

### Requirement: 全量样式保留入口并显式迁移全局主题

`serenova-ui/style.css` MUST 继续提供全量组件样式，但 MUST 不再向 `:root` 注入全局主题、改变全页 color-scheme 或响应全局 `[data-theme='dark']`。文档 MUST 说明将旧暗色属性切换迁移到 `SThemeProvider` 和暗色预设的方式，并区分当前实现与规划示例。

#### Scenario: 原有默认主题接入

- **WHEN** 使用者沿用包根组件与全量 CSS 导入且未配置主题
- **THEN** 默认组件外观保持一致，普通页面元素不被组件库全局主题初始化影响

#### Scenario: 迁移暗色主题

- **WHEN** 使用者按文档将全局暗色属性替换为提供者的暗色预设
- **THEN** 对应组件恢复暗色外观，切换预设即可切换主题
