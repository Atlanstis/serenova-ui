## Context

参见 `proposal.md` 的 Why 与 `specs/ui-quality-pipeline/spec.md` 的质量契约。当前 `tests/` 先按 `unit`、`browser`、`preview`、`visual`、`package` 等执行层级划分，再在部分层级内按组件划分；结果是 Button 的行为、浏览器与视觉用例分散，setup、helper、Fixture 和可执行用例也缺少统一的资产边界。

当前必须保留以下约束：

- 仓库继续使用 Vitest + happy-dom 承担快速测试，使用 Vitest Browser Mode + Chromium 承担真实浏览器组件测试。
- Storybook 预览集成继续由 Playwright 驱动。
- `tests/tsconfig.json` 继续作为唯一测试 TypeScript 项目，服务编辑器就近发现和 `type-check:test`。
- 源码、Story、测试和发布产物边界保持隔离，测试迁移必须保持组件公共 API 与构建输出契约。
- 测试输入与断言必须基于公共接口和用户可观察结果。

## Goals / Non-Goals

**Goals:**

- 使维护者从一个组件领域目录即可找到该组件的全部测试和局部 Fixture。
- 以文件后缀作为运行器发现协议，使测试对象分类与执行环境分类保持独立。
- 给后续所有公共组件建立必须完成公共契约分析的测试标准。
- 用真实浏览器中的聚焦断言保护关键原生行为、布局和计算样式，并移除当前无有效基线的像素截图门槛。
- 让 `AGENTS.md` 成为自动化代理实施组件时必须遵守的长期规则，而 `tests/README.md` 承担目录和命令细节。

**Implementation Boundaries:**

- 测试资产集中在根 `tests/` 工作区，局部 Fixture 与所属组件测试共置。
- 现有 Vitest、Vitest Browser Mode、Playwright 和 Storybook 工具链保持稳定。
- 截图回归的恢复条件由未来独立变更定义。
- 现有组件实现、Story 内容和发布包契约保持原有行为。

## Decisions

### 1. 测试工作区采用组件领域优先的结构

目标结构如下：

```text
tests/
├── README.md
├── tsconfig.json
├── support/
│   ├── vitest/
│   │   ├── unit.setup.ts
│   │   └── browser.setup.ts
│   └── playwright/
│       └── storybook.ts
├── components/
│   └── button/
│       ├── behavior.unit.spec.ts
│       ├── exports.unit.spec.ts
│       ├── public-types.unit.spec.ts
│       ├── native.browser.spec.ts
│       └── fixtures/
│           └── ButtonBrowser.fixture.vue
├── shared/
│   └── with-install.unit.spec.ts
├── integration/
│   └── storybook/
│       └── environment.preview.spec.ts
└── contracts/
    └── package/
        ├── package-smoke.mjs
        └── package-consumer.fixture.ts
```

`components/<component>/` 按被测公共组件聚合；`shared/` 验证共享源码；`integration/` 验证跨组件或开发环境；`contracts/` 验证构建产物和外部消费；`support/` 保存共享基础设施。服务单个组件或用例的 Fixture 与所有者共置，被多个领域复用的 Fixture 提升到 `support/`。

备选方案一是在现有层级结构外增加 `cases/` 与 `support/`。它能解决基础设施混放，但仍会让同一组件横跨多个运行器目录。备选方案二是把测试共置到 `src/`；它具有最短引用路径，但会增加构建、声明和发布排除规则，并让浏览器 Fixture 混入源码树。当前组件库以组件为主要维护单元，因此选择根测试工作区内的组件领域聚合。

### 2. 文件后缀是运行器选择的唯一协议

采用以下约定：

| 后缀                | 运行环境               | 主要目标                                        |
| ------------------- | ---------------------- | ----------------------------------------------- |
| `*.unit.spec.ts`    | Vitest + happy-dom     | 快速公共行为、纯逻辑、公共类型与源码导出        |
| `*.browser.spec.ts` | Vitest Browser Mode    | 原生 DOM 行为、焦点、键盘、布局、视口与计算样式 |
| `*.preview.spec.ts` | Playwright + Storybook | Story 发现、预览环境、参数和 `play` 交互集成    |
| `*.fixture.*`       | 测试辅助资产           | 局部消费样例或渲染载体                          |

Vitest 的两个命名 project 分别匹配 `tests/**/*.unit.spec.ts` 与 `tests/**/*.browser.spec.ts`。Playwright 匹配 `tests/**/*.preview.spec.ts`。运行器依据文件后缀选择用例，测试目录依据 `components`、`shared` 或 `integration` 表达所属领域。

`tests/tsconfig.json` 保留在测试工作区顶层，并覆盖所有 TypeScript 测试、Vue Fixture 和根工具配置；独立由测试脚本执行类型检查的包消费 Fixture 继续从常规测试项目中排除。迁移 `package-smoke.mjs` 后必须同步调整其仓库根路径计算，并更新 ESLint 中为包测试启用 Node 全局变量的路径匹配。

### 3. 组件测试基准按公共契约选择层级

后续组件先列出公共契约，再选择最低成本且能够可靠观察该契约的测试层：

```text
公共契约
   │
   ├─ happy-dom 能可靠观察 ───────▶ unit（每个公共组件必需）
   │
   ├─ 依赖真实 DOM/CSS/视口 ─────▶ browser（满足触发条件时必需）
   │
   ├─ 属于 Storybook 环境能力 ───▶ preview（集中验证）
   │
   └─ 属于发布包消费边界 ────────▶ contract（公共出口改变时更新）
```

快速测试是每个公共组件的最低门槛，覆盖内容按适用性从组件自己的 Props 与默认值、Slots、Events、渲染语义、状态变化和边界条件中推导。测试必须通过可见文本、属性、事件和公开 DOM 结果观察行为；公开视觉状态映射可以验证 class，真实样式行为必须由浏览器测试验证。

当契约涉及原生表单、焦点与键盘、拖放、Teleport、滚动与溢出、响应式布局、元素尺寸或计算样式时，必须添加浏览器测试。每个组件变更必须记录测试层选择结论。公共出口或类型改变时，必须同步更新源码出口测试和共享包消费 Fixture。

### 4. `AGENTS.md` 固化目标，`tests/README.md` 解释操作细节

`AGENTS.md` 新增“组件测试规范”章节，使用面向未来组件的规则表达以下内容：

- 测试输入与断言必须基于公共接口和用户可观察行为。
- 新增或修改公共组件时必须分析 Props、Slots、Events、语义、状态、边界和公共导出，并完成适用测试。
- 每个公共组件必须具有 `*.unit.spec.ts`；真实浏览器触发条件成立时必须具有 `*.browser.spec.ts`；Storybook 预览与包契约必须按影响范围更新。
- 结构快照投入使用时必须与明确行为断言配套。
- 测试文件、Fixture 与共享 support 必须遵循工作区归属和后缀规则；测试范围必须从每个组件自身的公共契约推导。
- 组件完成定义必须包含适用测试、测试类型检查及受影响质量命令通过；变更记录必须包含各测试层选择结论。

`AGENTS.md` 保存稳定原则与完成门槛；`tests/README.md` 保存具体命令、完整目录树、当前覆盖和迁移示例，使两份文档各自具有单一职责。

### 5. 移除截图回归，以聚焦浏览器断言承接关键视觉契约

删除 `tests/visual/button.visual.spec.ts`、`test:visual` 脚本以及 Playwright 中服务 `toHaveScreenshot` 的容差配置；质量入口必须显式运行 Storybook 预览集成。`test:e2e` 保留为 `test:preview` 的兼容别名，文档以 `test:preview` 为规范入口。

Button 作为迁移验证样例：在现有浏览器测试中补充能够代表其公共视觉契约的少量断言，例如尺寸状态对应的实际高度、代表性变体的计算颜色、禁用状态的可观察样式和加载指示器尺寸。断言必须聚焦公共视觉契约与设计令牌。

未来恢复截图回归必须同时满足：组件视觉结构已经稳定；基线文件纳入版本控制；浏览器、操作系统、字体、视口和动画策略固定；差异具有明确审查与更新流程。本次迁移必须清理全部空的旧目录。

### 6. 现有公开命令尽量保持兼容

`test:unit`、`test:browser`、`test:preview` 和 `test:package` 保持兼容，只调整发现模式与文件路径。`quality` 继续包含类型检查、快速测试、浏览器测试、Storybook 预览集成、构建和包级验证。`test:e2e` 保留为预览集成兼容入口并仅委托 `test:preview`；README 必须明确其别名关系。

## Risks / Trade-offs

- [按组件聚合后无法仅凭目录判断运行器] → 使用强制文件后缀、互斥 include 和 README 对照表，并验证每个命令只发现预期文件。
- [移动文件后某些用例被静默漏跑] → 迁移前后记录各运行器收集的文件清单，并分别执行 unit、browser、preview 和 package 命令对比。
- [聚焦样式断言过度绑定实现值] → 将断言集合限定为公共 API 或设计令牌承诺的视觉结果。
- [取消截图后无法检测未知的组合视觉变化] → 以组件 Story 人工审查、关键浏览器断言和代码审查覆盖当前阶段；达到明确恢复条件后再建立低噪声截图基线。
- [`AGENTS.md` 规则变成机械检查清单] → 以“按适用性推导”和测试边界说明作为验收依据。
- [包测试目录加深导致临时消费路径错误] → 更新仓库根与 Fixture 路径计算，并以构建后的完整包级冒烟验证迁移。
- [保留 `test:e2e` 别名造成命名歧义] → 文档以 `test:preview` 为规范名称；后续若确认没有外部调用，再单独删除兼容别名。

## Migration Plan

1. 运行并记录现有类型检查、unit、browser、preview 和 package 测试结果及用例发现清单，作为迁移基线；同时记录截图测试当前的基线状态。
2. 建立 `support`、`components`、`shared`、`integration` 和 `contracts` 目录，使用可保留历史的移动方式迁移现有测试与 Fixture，并删除全部空的旧层级目录。
3. 按统一后缀重命名用例，更新相对导入、Vitest include、Playwright testMatch、测试 TypeScript 排除项和包冒烟路径计算。
4. 将截图覆盖的关键 Button 视觉契约收敛为少量真实浏览器断言，删除截图用例和截图专用配置。
5. 更新 package scripts 与质量入口，保留 `test:e2e` 兼容别名，并确保 Playwright 继续服务预览集成与 Vitest Browser Mode。
6. 在 `AGENTS.md` 写入通用组件测试规范，在根 README 与 `tests/README.md` 同步目录、后缀、命令、分层选择和截图恢复前提。
7. 分别运行格式检查、Lint、完整类型检查、unit、browser、preview、构建、Storybook 双模式构建和 package 冒烟，再执行统一质量入口确认迁移后行为一致。

迁移回滚通过恢复原目录、发现 glob、脚本和截图相关配置完成，同时保持持久化数据与外部 API 状态稳定。
