## Context

参见 `proposal.md` 的动机。仓库当前把 `happy-dom` 下的快速组件测试命名为 unit，把 Vitest Browser Mode 下的真实浏览器组件测试命名为 browser，并使用 Playwright 启动 Storybook 验证开发环境。发布包测试已经能独立检查构建产物的解析、模块格式、类型声明与文件边界。

这导致两个语义错位：`browser` 描述运行环境而不是测试层级，`preview` 虽由 Playwright 执行却不是端到端消费流程。新的结构需要支持未来具有表单、焦点、Teleport、溢出、布局和组件协作等不同契约的组件，不能从当前 Button 用例机械复制固定测试清单。

## Goals / Non-Goals

**Goals:**

- 用单元、集成和 E2E 三层表达测试意图，并让文件名、运行器和命令保持一一对应
- 让每个公共组件都具有低成本黑盒单元测试，同时按公共契约决定是否需要真实浏览器集成测试
- 让 Playwright 通过最小消费应用验证构建产物的代表性用户流程
- 保持发布契约测试独立，避免浏览器 E2E 承担模块解析、声明和 npm 文件清单验证
- 将选择规则写入 `AGENTS.md`，使后续自动化代理明确分析范围、测试层和完成条件

**Non-Goals:**

- 不为每个组件强制创建集成测试或 E2E
- 不建立截图回归、完整 WCAG 自动扫描或独立无障碍测试体系
- 不在首阶段扩展 Firefox、WebKit 或移动设备项目
- 不自动测试 Storybook 的 Story 发现、主题、RTL、视口、Docs 或 `play` 执行
- 不在本变更中重新设计现有组件公共 API 或依据现有 Button 用例定义通用模板

## Decisions

### 1. 以测试意图命名三层，而不是以工具命名

测试资产采用以下映射：

```text
tests/
├── components/<component>/
│   ├── *.unit.spec.ts
│   ├── *.integration.spec.ts
│   └── fixtures/
├── shared/
│   └── *.unit.spec.ts
├── e2e/
│   ├── *.e2e.spec.ts
│   └── fixtures/consumer-app/
├── contracts/package/
└── support/
```

`*.unit.spec.ts` 继续由 Vitest、Vue Test Utils 和 `happy-dom` 执行。`*.integration.spec.ts` 由 Vitest Browser Mode 和 Chromium 执行，替代当前 `*.browser.spec.ts` 命名。`*.e2e.spec.ts` 由 Playwright 执行。

选择这一结构是因为层级名称表达测试承担的置信度与范围，而 Chromium 只是集成测试当前采用的执行环境。备选方案是保留 `browser` 后缀，但它会继续把运行环境和测试意图混为一谈。

### 2. 单元测试是每个公共组件的必选基线

每个组件先枚举 Props 及默认值、Slots、Events、可观察渲染、交互状态、边界条件、源码类型和公共导出，再从适用项生成测试。测试通过挂载、属性更新和用户交互观察 DOM、事件或公共类型，不访问 `wrapper.vm` 中的内部状态，不直接调用私有处理函数。

类型与单组件源码导出仍在快速层验证，因为它们无需真实浏览器。构建后的声明入口与导出映射由发布契约测试验证，形成源码契约与发布契约两道不同检查。

备选方案是把所有组件挂载都视为集成测试，仅保留纯函数单元测试；这会削弱每个组件必须具备的快速反馈入口，因此不采用。

### 3. 集成测试由浏览器或协作契约触发

当公共契约涉及以下任一条件时增加 `*.integration.spec.ts`：

- 原生表单行为
- 真实焦点、键盘或浏览器事件
- Teleport 或跨 DOM 容器交互
- 滚动、溢出、响应式布局、元素尺寸或计算样式
- 多个公共组件或共享上下文协作

集成测试只挂载验证契约所需的最小 Fixture，并沿用现有轻量化无障碍规则：鼠标和键盘触发同一操作时验证一致的可观察业务结果；只有真实焦点或键盘行为才进入真实浏览器。没有上述条件的组件无需为了满足数量而增加集成测试。

备选方案是每个组件强制至少一条浏览器测试，但这会增加启动 Chromium 的固定成本，并产生缺乏独立验证价值的用例。

### 4. E2E 使用映射到 `dist` 的最小消费应用

在 `tests/e2e/fixtures/consumer-app/` 建立独立的最小 Vue 应用。应用代码只使用 `serenova-ui` 与 `serenova-ui/style.css` 公共入口；其 Vite 测试配置把这两个入口精确映射到当前 `dist` 产物。Playwright 在运行前确保完成构建，再启动该应用并执行 `*.e2e.spec.ts`。

使用 `dist` 映射而非每次创建临时目录并执行包管理器安装，可以减少 E2E 启动成本；独立发布契约测试已经覆盖 npm pack 文件清单和真实包解析，因此两者组合能够覆盖映射方案省略的安装细节。

E2E 按关键用户流程组织，候选流程必须至少满足一项：跨多个组件、验证全量或按需安装与全局样式、覆盖关键表单或浮层操作链路、或防止一个高影响消费回归。简单组件若没有引入新流程，不创建专属 E2E。首阶段只配置 Chromium。

### 5. Storybook 退出自动化测试金字塔

删除当前 `environment.preview.spec.ts` 和只服务该测试的 Storybook URL helper。Playwright 配置改为发现 `*.e2e.spec.ts` 并启动最小消费应用，而不是启动 Storybook。

Stories、Docs、Controls、Actions、Viewport 和 `play` 继续用于开发期调试，`type-check:storybook` 继续检查相关 TypeScript。Storybook 环境可用性不再是 `quality` 的发布门槛，组件公共行为必须在三层测试中独立得到验证。

备选方案是保留一条 Storybook 启动冒烟；鉴于 Storybook 不交付且已有类型检查，这条测试仍不能证明组件产物可消费，因此不保留。

### 6. 发布契约测试保持第四条正交检查

`tests/contracts/package/` 继续独立验证 ESM、CommonJS、默认插件、具名导出、CSS、类型声明、Vue external 和 npm 文件边界。它不改名为 integration 或 E2E，因为其测试对象是发布协议而非组件交互。

实现时应让单独运行 E2E 和发布契约测试都能自行获得新鲜构建产物；聚合 `quality` 则应尽可能只构建一次，再复用产物执行两类检查，避免无意义的重复构建。

### 7. 更新质量入口与贡献者规则

`check` 保持低成本，包含格式、Lint、类型检查和单元测试，不启动 Chromium 或消费应用。`quality` 在 `check` 基础上执行集成测试、一次构建、E2E 和发布契约测试。

`AGENTS.md` 的“组件测试规范”将明确：

- 每个公共组件必须先分析完整公共契约并具有 `*.unit.spec.ts`
- 只在浏览器或组件协作条件适用时增加 `*.integration.spec.ts`
- E2E 使用构建产物和最小消费应用，按代表性用户流程选择，不按组件逐一建立
- 发布契约测试独立于三层测试
- Storybook 不作为自动化测试载体
- 完成前记录每层是否适用，并运行类型检查与受影响的 unit、integration、e2e、package 命令

同一文件中轻量化无障碍章节现有的 `*.browser.spec.ts` 引用也需同步改为 `*.integration.spec.ts`，避免规则冲突。

## Risks / Trade-offs

- [将现有 browser 测试改名为 integration 可能让“集成”范围被误解为必须跨组件] → 在文档中明确真实浏览器原生契约本身也属于本仓库的集成边界
- [E2E 通过 Vite 映射 `dist`，没有重复验证真实 npm 安装] → 保留独立 package smoke 对 pack、解析和类型消费进行真实验证
- [E2E 和 package 命令分别运行时可能重复构建] → 保持细分命令可独立执行，在 `quality` 聚合路径中复用一次新鲜构建
- [删除 Storybook 自动化后开发工作台故障可能稍晚被发现] → 保留 Storybook 类型检查；Storybook 本身作为非交付调试工具接受该权衡
- [代表性 E2E 的选择可能随组件增加而失控] → 要求每次组件变更记录适用性和对应用户流程，不以组件数量作为 E2E 数量目标
- [固定计算样式断言容易因非契约视觉调整而脆弱] → 只断言明确属于公共契约的尺寸、定位、溢出或计算样式，不恢复大范围截图基线

## Migration Plan

1. 先调整 Vitest 测试项目名称、发现后缀和 npm scripts，并迁移现有真实浏览器测试文件，确保迁移前后测试数量一致。
2. 建立最小消费应用和代表性 Playwright 流程，使其从新鲜 `dist` 载入组件与样式。
3. 将 Playwright 从 Storybook 预览宿主切换为消费应用，删除 Storybook 环境测试及专用 helper。
4. 调整发布契约命令与 `quality` 的构建复用关系，保证细分命令和聚合入口均不依赖陈旧产物。
5. 更新 `AGENTS.md`、`tests/README.md`、根 `README.md` 和 OpenSpec 主规格表述。
6. 运行全部静态检查、类型检查、三层测试、发布契约测试和完整质量入口。

若迁移失败，可在未合并前恢复旧文件后缀、Vitest project、Playwright Storybook webServer 与 npm scripts；组件源码和公共 API 不参与本变更，因此无需产品数据或 API 回滚。
