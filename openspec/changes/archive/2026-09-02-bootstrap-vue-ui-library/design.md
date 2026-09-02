## Context

仓库当前是单包 Vue 3 项目，已通过 Vite library mode 从 `src/index.ts` 生成 ESM 与 CommonJS，并使用 `vue-tsc` 生成声明文件；Vue 已作为 peer dependency 和构建 external。现有根插件为空实现，`src/button` 等领域目录尚无组件文件，缺少 CSS 产物、开发预览、测试配置、发布冒烟验证和完整 README。具体动机见 `proposal.md`，外部行为约束见本变更下四份能力规格。

本设计需要保持现有 pnpm、Vite、Vue 3.5、TypeScript 和单包发布方式，避免为首个组件引入 Naive UI 级别的自定义文档编译、CSS-in-JS 主题系统或多包构建复杂度。

## Goals / Non-Goals

**Goals:**

- 建立可以复制到后续组件的领域目录、公共类型、安装与导出模式。
- 保持公共组件声明式、可读、可测试，同时为高度动态的内部渲染器保留 TSX 出口。
- 让同一组 Story 同时服务源码调试、交互文档、发布产物检查和视觉测试。
- 将快速反馈与真实浏览器准确性结合，并形成发布前统一质量入口。
- 在不破坏当前构建基础的前提下补齐 npm 包元数据、样式与消费验证。

**Non-Goals:**

- 本变更不实现 Input、Select 或其他公共组件。
- 本变更不建立完整主题 Provider、运行时换肤系统、CSS-in-JS 或设计令牌生成流水线。
- 本变更不迁移为 monorepo，也不引入独立组件子包和自动按组件发布。
- 本变更不接入 Histoire、VitePress 或自建文档编译系统；Storybook 承担组件开发、预览与交互文档职责。
- 本变更不建立自动版本号、changelog 或正式 npm 发布流水线，只保证人工发布前可验证。
- 首阶段浏览器 CI 以 Chromium 为基线，不承诺完整 Firefox/WebKit 矩阵。

## Decisions

### 1. 保持单包，源码按组件领域组织，测试集中分层

源码与测试采用以下可扩展结构：

```text
src/button/
├── src/
│   ├── Button.vue
│   └── public-types.ts
├── stories/
│   ├── Button.stories.ts
│   └── Button.stories.css
└── index.ts
tests/
├── unit/button/
├── browser/button/
├── preview/
├── visual/
└── package/
```

共享安装辅助类型放入 `src/shared/`，全局样式与令牌放入 `src/styles/`，根入口通过 `src/components.ts` 汇总公共组件。组件实现、Story 和公共入口按组件领域聚合；所有自动化测试、Fixture 与测试辅助统一位于根 `tests/`，先按运行层级划分，再按组件或共享领域细分。这样可以直接从目录识别运行器和职责边界，并避免 Vitest 与 Playwright 的发现范围交叉。

备选方案是把组件测试共置在 `src/<component>/tests/`；该方案缩短单个组件的相对路径，但会让测试资产散落在源码树与根测试目录，并增加各运行器、类型检查和发布排除配置的维护成本，因此不采用。

### 2. 公共组件默认使用 Vue SFC Template

`SButton` 使用 `<script setup lang="ts">`、Template 和 scoped CSS；状态推导使用 computed，副作用与可复用逻辑才提取为 composable。只有当内部渲染结构由 Schema、递归节点或动态 VNode 工厂驱动，且 Template 明显降低可维护性时，才允许内部文件使用 TSX。

该选择利用 Vue Template 的静态分析与编译优化，也让组件结构和样式更直观。全库 TSX 虽能统一 JavaScript 表达方式，但不会天然提高运行性能，并会增加插件、类型和插槽语法复杂度，因此不作为默认方案。

### 3. 统一全量安装与按需导入

组件目录导出带安装能力的 `SButton` 及公共类型；根插件维护公共组件列表并逐一注册。根入口同时导出默认插件、`SButton` 和类型，使以下两种模式共享同一组件定义：

```ts
app.use(SerenovaUI)
```

```ts
import { SButton } from 'serenova-ui'
```

安装逻辑集中到泛型 `withInstall` 辅助函数，避免每个组件重复声明 Plugin 类型和注册流程。备选方案是在根插件内直接硬编码注册，首个组件更简单但不利于后续扩展与单组件安装，因此不采用。

### 4. 使用构建时提取的单一 CSS 入口

组件局部样式保留在 SFC，公共令牌与基础变量放在 `src/styles/`。内部 `src/bundle-entry.ts` 重新导出公共 `src/index.ts` 并纳入样式依赖，由 Vite 生成单一 `serenova-ui.css`；声明构建排除该内部入口，避免 `dist/index.d.ts` 保留无法发布的源码 CSS 引用。样式通过 `exports["./style.css"]` 暴露，`sideEffects` 保留 CSS 匹配，README 明确要求使用者导入样式入口。

首阶段选择单 CSS 文件以降低构建和消费复杂度，代价是按需导入一个组件时仍加载完整库样式。等组件规模和样式体积证明有必要后，再设计组件级 CSS 子路径；本次不提前引入 preserveModules 或 CSS-in-JS。

### 5. Storybook 使用 Vue3/Vite 框架和双解析模式

`.storybook/` 只维护 Storybook 框架、全局预览和主题样式配置；组件 Story 与专用样式收拢在组件领域的 `stories/` 子目录。源码模式把 `serenova-ui` 与 `serenova-ui/style.css` alias 到 `src`，产物模式先构建库，再将相同公共导入解析到 `dist`。Story 始终使用真实包名导入，不通过相对路径绕过公共入口。

组件状态使用 CSF Story 描述，并由 Storybook 自动发现。Controls 用于调节 Props，Actions 和 `play` 函数用于观察及复现交互，Docs 集中承载单个组件的 API、示例和交互说明，README 只保留组件库级别的接入、开发、测试和发布文档。Viewport 与全局工具栏统一提供主题和 RTL 环境。`tsconfig.build.json` 排除 Story 与根测试目录，独立 Storybook 和测试 TypeScript 配置分别检查预览代码与测试代码，从而保持发布边界清晰。

产物模式的 Vite 解析守卫禁止 Storybook 读取组件实现和全局样式源码，仅允许 `stories/` 下的预览资产；它与包级冒烟分别验证可视消费和模块导出。备选方案是继续维护手写 playground，但其导航、控件、文档和状态持久化都需要重复建设，因此不再采用。

### 6. 测试分为快速、浏览器、视觉和包级四层

- Vitest 与 Vue Test Utils 在 DOM 模拟环境中覆盖公共 Props、Slots、Events、状态和 composables。
- Vitest Browser Mode 使用 Playwright Chromium 验证表单、真实布局和计算样式。
- 稳定的 Story 状态矩阵用于截图回归，CI 固定操作系统、浏览器、字体、视口、时区并关闭非必要动画。
- 包级冒烟测试从 `dist` 公共入口加载默认插件、具名组件、CSS 和类型，防止源码测试掩盖导出错误。

行为断言是正确性主证据；HTML 快照只允许作为小范围辅助。视觉截图只覆盖稳定、具有回归价值的状态，避免形成高噪声基线。

### 7. 发布构建继续使用 Vite 与 vue-tsc

保留当前 ESM/CommonJS Vite 构建和 `vue-tsc` 声明输出，补充 CSS 子路径、License、repository、homepage、keywords 等元数据。构建声明配置排除测试与 Story，`files` 继续限制发布目录。统一质量命令在发布 dry-run 前串联类型检查、快速测试、浏览器测试、Storybook 构建、视觉检查、构建和包级冒烟。

备选方案是立即迁移到 tsdown 或 unbundle 构建；当前单入口规模没有证明迁移收益，且会扩大本变更风险，因此继续使用现有工具链。

### 8. Button 以原生语义为中心

`SButton` 只有一个原生 `<button>` 根节点，默认 `nativeType="button"`，避免在表单中意外提交。组件声明 `click` 公共事件并在可用状态显式发出；`disabled` 或 `loading` 映射为不可交互状态。单根节点允许 class、style 和未声明原生属性自然透传。

视觉 API 使用 `variant` 区分外观、`nativeType` 表达原生表单类型，避免以一个 `type` Prop 同时承担两种含义。公共类型单独导出，为后续文档与类型测试提供稳定入口。

## Risks / Trade-offs

- [单一 CSS 文件使按需导入仍加载全部样式] → 首阶段接受该成本并记录产物体积，只有达到明确阈值后再引入组件级样式入口。
- [源码预览与产物预览的 alias 可能漂移] → Story 始终使用包名导入，并将 Storybook 产物模式与包级冒烟纳入发布前检查。
- [共置的 Story 或根测试目录可能泄漏到声明文件和 npm 包] → 构建 TypeScript 配置显式排除这些路径，并通过包内容 dry-run 断言发布文件列表。
- [浏览器和视觉测试增加 CI 时间] → 快速测试用于本地高频反馈，浏览器与视觉层按独立命令运行并复用少量关键状态矩阵。
- [视觉截图因平台差异产生噪声] → 只在固定 CI 环境更新基线，并固定字体、视口、时区和动画策略。
- [npm 包名当前未占用但不能被规划锁定] → 在首次发布前再次查询 registry，冲突时只调整包元数据和文档，不改变组件 API。

## Migration Plan

1. 在不改变现有包名和 Vue peer 范围的前提下，先补齐目录、测试依赖和独立配置。
2. 实现安装辅助、根导出、样式入口和 `SButton`，再建立源码 Storybook。
3. 添加快速与浏览器测试，随后增加 Storybook 交互、视觉和 `dist` 冒烟检查。
4. 完善 npm 元数据、README 与 License，运行完整质量入口和包内容 dry-run。
5. 如任一步骤无法通过，可回退新增入口、脚本和目录；本变更不包含持久化数据或不可逆迁移。
