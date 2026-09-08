# library-packaging Specification

## Purpose

定义 Serenova UI 作为 Vue 3 npm 组件库对使用者公开的安装入口、模块与类型产物、样式加载方式、包内容边界及发布前可验证条件。

## Requirements

### Requirement: 支持全量安装与具名导入

组件库 SHALL 提供可通过 `app.use()` 安装的默认 Vue 插件，并 SHALL 从包根入口具名导出所有公共组件及其公共类型。

#### Scenario: 全量安装组件库

- **WHEN** 使用者从 `serenova-ui` 导入默认插件并调用 `app.use()`
- **THEN** 所有公共组件均以约定名称完成全局注册

#### Scenario: 按需导入组件

- **WHEN** 使用者从 `serenova-ui` 具名导入 `SButton`
- **THEN** 使用者无需安装默认插件即可在 Vue 组件中直接使用 `SButton`

### Requirement: 发布模块、样式与类型产物

组件库 MUST 生成与 `package.json` 导出映射一致的 ESM、CommonJS、CSS 和 TypeScript 声明产物，并 SHALL 提供稳定的 `serenova-ui/style.css` 样式子路径。

#### Scenario: ESM 使用者加载组件库

- **WHEN** ESM 项目导入 `serenova-ui` 和 `serenova-ui/style.css`
- **THEN** 模块、组件样式和类型声明均可被构建工具正确解析

#### Scenario: CommonJS 使用者加载组件库

- **WHEN** CommonJS 环境通过包根入口加载 `serenova-ui`
- **THEN** 环境解析到 CommonJS 产物且公共导出与 ESM 入口一致

### Requirement: Vue 作为外部对等依赖

组件库 MUST 将 Vue 声明为对等依赖并从发布 JavaScript 产物中外置，以避免使用者应用中出现第二份 Vue 运行时。

#### Scenario: 检查构建产物依赖

- **WHEN** 发布构建完成并检查生成的 JavaScript 产物
- **THEN** 产物引用使用者提供的 Vue 运行时而不是内嵌 Vue

### Requirement: 限制 npm 包内容

发布包 MUST 只包含使用者需要的构建产物、包元数据、README 和 License，并 MUST 排除 Story、Storybook 配置与静态站点、测试、源码规划文件和本地开发配置。

#### Scenario: 检查待发布文件

- **WHEN** 维护者执行包内容 dry-run
- **THEN** 输出文件列表仅包含约定的发布文件且不存在开发专用目录

### Requirement: 提供可执行的使用与发布文档

README SHALL 说明安装、全量与按需使用、样式导入、本地开发、测试、构建、包内容检查和 npm 发布步骤；单个组件的 API 与交互说明 SHALL 由 Storybook Docs 提供。

#### Scenario: 新使用者阅读 README

- **WHEN** 使用者按照 README 安装并引入组件库
- **THEN** 使用者能够完成全量或按需接入，并从 Storybook Docs 查阅单个组件说明，无需了解仓库内部结构

#### Scenario: 维护者准备发布

- **WHEN** 维护者按照 README 执行发布前命令
- **THEN** 类型检查、测试、构建和包内容检查在实际发布前全部完成

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
