## Purpose

定义 Serenova UI 作为 Vue 3 npm 组件库对使用者公开的安装入口、模块与类型产物、样式加载方式、包内容边界及发布前可验证条件。

## ADDED Requirements

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
