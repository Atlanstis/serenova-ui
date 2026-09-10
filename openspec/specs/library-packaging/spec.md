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
- **THEN** 使用者可在 Vue 组件中直接使用具名导入的 `SButton`

### Requirement: 发布模块、样式与类型产物

组件库 MUST 生成与 `package.json` 导出映射一致的 ESM 和 TypeScript 声明产物，JavaScript 产物 MUST 仅采用 ESM 格式；包根与公共 JavaScript 子路径 MUST 仅提供 `types` 和 `import` 导出条件；`main` 与 `module` MUST 指向包根 ESM 产物，包 MUST 声明 `type: module`。组件基础样式 MUST 仅通过 JS 产物分发并自动加载。

#### Scenario: ESM 使用者加载组件库

- **WHEN** ESM 项目仅导入并在客户端使用 `serenova-ui`
- **THEN** 模块和类型声明可被正确解析，组件样式随组件使用自动加载

#### Scenario: 检查仅 ESM 发布边界

- **WHEN** 检查发布包及包根、button、theme-provider、themes/light、icons 入口的导出映射
- **THEN** JavaScript 产物仅为 ESM，各 JavaScript 入口仅有 `types` 和 `import` 条件，`main` 与 `module` 指向包根 ESM 产物

#### Scenario: CommonJS 使用者加载组件库

- **WHEN** 消费方使用 `require('serenova-ui')` 或通过 `require` 加载公共 JavaScript 子路径
- **THEN** 导出映射仅匹配 ESM 的 import 条件，消费方须通过 ESM 导入加载组件库

### Requirement: Vue 作为外部对等依赖

组件库 MUST 将 Vue 声明为对等依赖并从发布 JavaScript 产物中外置，以避免使用者应用中出现第二份 Vue 运行时。

#### Scenario: 检查构建产物依赖

- **WHEN** 发布构建完成并检查生成的 JavaScript 产物
- **THEN** 产物通过外部依赖引用使用者提供的 Vue 运行时

### Requirement: 限制 npm 包内容

发布包 MUST 只包含使用者需要的构建产物、包元数据、README 和 License。

#### Scenario: 检查待发布文件

- **WHEN** 维护者执行包内容 dry-run
- **THEN** 输出文件列表仅包含约定的发布文件

### Requirement: 提供可执行的使用与发布文档

README SHALL 明确仅发布 ESM，并提供 ESM 导入示例；README SHALL 说明安装、全量与按需使用、随 JS 自动加载样式的接入方式、仅客户端支持边界、本地开发、测试、构建、包内容检查和 npm 发布步骤；单个组件的 API 与交互说明 SHALL 由 Storybook Docs 提供。

#### Scenario: 新使用者阅读 README

- **WHEN** 使用者按照 README 安装并引入组件库
- **THEN** 使用者能够完成全量或按需接入，并从 Storybook Docs 查阅单个组件说明

#### Scenario: 维护者准备发布

- **WHEN** 维护者按照 README 执行发布前命令
- **THEN** 类型检查、测试、构建和包内容检查在实际发布前全部完成

#### Scenario: 查阅模块接入说明

- **WHEN** 消费方阅读 README 中的模块接入说明
- **THEN** 文档明确 JavaScript 产物仅采用 ESM 格式，并给出 ESM 导入方式

### Requirement: 支持组件与主题的独立公共子路径

组件库 MUST 提供 `serenova-ui/button`、`serenova-ui/theme-provider`、`serenova-ui/icons` 的 ESM 与类型入口。内置主题预设子路径 MUST 仅提供 `serenova-ui/themes/light` 的预设及对应类型入口。六个图标及 `IconProps` MUST 同时从包根和 icons 集合入口具名导出；图标公共导入路径 MUST 限定为包根和 icons 集合入口。主题提供者 SHALL 仅提供主题上下文，图标 SHALL 使用自包含的内联 SVG。包根 MUST 导出组件、插件及 Provider 公共类型，默认插件 SHALL 注册六个图标，每个图标 SHALL 支持单组件 app.use 安装。

#### Scenario: 按需消费按钮

- **WHEN** 消费应用仅导入 `serenova-ui/button` 并在客户端渲染按钮
- **THEN** 应用可使用完整默认按钮及加载图标，基础样式由按钮自动加载

#### Scenario: 按需消费浅色预设

- **WHEN** 消费应用导入主题提供者及浅色预设
- **THEN** 公共导出和声明可解析，预设依赖范围仅包含主题数据与类型

#### Scenario: 自定义主题配色

- **WHEN** 消费应用需要自定义配色
- **THEN** 使用者通过 Provider 的 preset 或 tokens 配置所需颜色

#### Scenario: 从集合入口消费一个图标

- **WHEN** 消费应用从 `serenova-ui/icons` 具名导入 SIconAdd 并进行支持 tree shaking 的 ESM 生产构建
- **THEN** 图标可使用且组件相关产物仅包含所用图标及其必要依赖

#### Scenario: 验证公共子路径范围

- **WHEN** 消费端检查包导出映射中的 JavaScript 子路径
- **THEN** 子路径集合恰好为 button、theme-provider、themes/light 和 icons，每个入口均显式声明

#### Scenario: 安装图标

- **WHEN** 消费端使用默认插件或对单个图标调用 app.use
- **THEN** 对应图标以约定名称全局注册，具名导入可直接使用

### Requirement: 样式发布遵循组件依赖边界

每个组件的自动样式 MUST 仅覆盖该组件的全部运行时状态和必要依赖，作用域 MUST 限于对应组件。组件在浏览器使用时 MUST 自动挂载对应基础样式。所有普通 JS 入口 MUST 可在 Node 中直接加载，模块求值阶段 MUST 仅使用 Node 与浏览器共有的 JavaScript 能力，DOM 样式挂载 MUST 在客户端渲染时执行；该 Node 契约 MUST 仅覆盖模块加载。自动样式路径 MUST 在构建后保持有效。

#### Scenario: 验证样式依赖范围

- **WHEN** 最小消费构建只使用某一组件，而测试构建中还存在一个无关组件
- **THEN** 产物中的组件样式仅包含所用组件及必要依赖规则

#### Scenario: 动态改变按钮状态

- **WHEN** 按需消费的按钮在运行时切换 variant、size 或 loading
- **THEN** 组件自动加载的样式完整覆盖对应状态

#### Scenario: Node 消费模块

- **WHEN** Node 通过 ESM 加载包根、组件、提供者和预设入口
- **THEN** 通过 Node 原生 ESM 加载成功，浏览器相关初始化在客户端渲染阶段执行

### Requirement: 组件渲染仅支持浏览器客户端

组件库 MUST 将组件渲染支持范围限定为浏览器客户端；公共 JavaScript 子路径 MUST 限定为本规格列出的组件、主题提供者、浅色预设和图标入口。Node 验证 SHALL 仅覆盖模块加载和 ESM 发布契约。

#### Scenario: 确认支持边界

- **WHEN** 使用者查阅接入文档和包导出
- **THEN** 文档明确组件渲染仅支持浏览器客户端，公共导出符合上述入口范围，组件可在客户端直接使用

### Requirement: 样式接入统一使用 JavaScript 入口

组件库 MUST 仅通过公共 JavaScript 入口提供组件样式，package.json MUST 仅通过 JavaScript 入口描述样式接入方式，`style` 字段 MUST 保持缺省，样式资源 MUST 内聚于 JavaScript 产物。文档 MUST 指导使用者直接导入并渲染组件，以自动获得默认主题外观。

#### Scenario: 检查样式接入元数据

- **WHEN** 消费端检查 package.json 与接入文档
- **THEN** 样式接入统一指向公共 JavaScript 入口，导出映射仅提供本规格约定的公共入口
