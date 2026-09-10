# 测试工作区与组件测试基准

本目录集中保存自动化测试、局部 Fixture、E2E 消费应用、发布包消费样例和共享测试基础设施。组件实现与 Story 保留在 `src/`，测试按对象和职责聚合，运行层级通过文件后缀标识。

## 目录结构

```text
tests/
├── components/                    # 公共组件单元与集成测试
│   └── <component>/
│       ├── *.unit.spec.ts
│       ├── *.integration.spec.ts
│       └── fixtures/
├── shared/                        # 共享源码单元测试
├── e2e/                           # 代表性消费流程
│   ├── *.e2e.spec.ts
│   └── fixtures/consumer-app/     # 基于 dist 的最小消费应用
├── contracts/package/             # 构建产物与包消费契约
├── support/vitest/                # 跨领域 Vitest setup
└── tsconfig.json                  # 测试 TypeScript 项目
```

| 目录          | 职责                                                               |
| ------------- | ------------------------------------------------------------------ |
| `components/` | 按公共组件聚合快速单元测试、适用的真实浏览器集成测试和局部 Fixture |
| `shared/`     | 验证共享源码公共契约与纯逻辑                                       |
| `e2e/`        | 从构建产物消费方视角验证代表性关键用户流程                         |
| `contracts/`  | 独立验证发布产物、导出协议和外部消费边界                           |
| `support/`    | 保存跨领域复用的 setup 与 helper                                   |

`tests/tsconfig.json` 是唯一的测试 TypeScript 项目，继承根 `tsconfig.base.json` 的编译基线，并由根 `tsconfig.json` 项目引用统一发现，覆盖测试文件、Vue Fixture、Vite、Vitest 和 Playwright 配置。E2E 消费应用的 TypeScript 解析保持公共包名，运行时则由专用 Vite 配置精确映射到当前 `dist`。

## 测试分层

| 后缀或目录              | 运行器                               | 验证目标                                                                             |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| `*.unit.spec.ts`        | Vitest + happy-dom + Vue Test Utils  | Props、默认值、Slots、Events、渲染结果、状态变化、边界条件、源码类型和公共导出       |
| `*.integration.spec.ts` | Vitest Browser Mode + Chromium       | 原生表单、真实焦点与键盘、浏览器事件、Teleport、滚动、布局、尺寸、计算样式和组件协作 |
| `*.e2e.spec.ts`         | Playwright + Chromium + 最小消费应用 | 当前 `dist` 的公共安装、样式加载和代表性关键用户流程                                 |
| `contracts/package/`    | Node.js + TypeScript                 | ESM、自动样式、声明、插件、导出映射、Vue external 和 npm 文件边界                    |

`vitest.config.ts` 使用 `unit` 与 `integration` 两个互斥 project；`playwright.config.ts` 只发现 E2E 用例并启动最小消费应用。测试 API 必须从对应运行器显式导入。

## 组件测试基准

- 新增或修改公共组件时，先分析 Props 及默认值、Slots、Events、渲染语义、交互状态、边界条件、源码类型和公共导出，再从适用契约推导测试，不复制其他组件的固定用例集合。
- 每个公共组件必须具有 `*.unit.spec.ts` 快速黑盒测试。测试只能通过公共接口和用户可观察结果证明行为，不访问内部状态或私有方法。
- 契约涉及原生表单、真实焦点与键盘、浏览器事件、Teleport、滚动与溢出、响应式布局、元素尺寸、计算样式或组件协作时，必须增加 `*.integration.spec.ts`；没有这些条件时无需为了数量增加集成测试。
- 集成测试使用最小必要 Fixture。鼠标与键盘触发同一操作时，应验证二者产生一致的可观察业务结果。
- E2E 按用户流程组织，不按公共组件逐一建立。涉及多个组件、全量或按需安装与全局样式、关键表单或浮层链路、高影响消费回归时，评估并按需增加 E2E。
- 公共出口或类型发生变化时，同步更新源码出口测试和 `contracts/package/package-consumer.fixture.ts`；发布协议仍由独立 package 测试负责。
- 单个组件或用例使用的 Fixture 与所属测试共置；跨领域复用资产进入 `support/`；E2E 专用应用与资产进入 `e2e/`。
- 所有异步交互必须等待 `trigger`、`setValue` 或浏览器操作完成；外部 Promise 使用 `flushPromises` 等待完成。
- 结构快照必须与明确行为或语义断言配套，不得作为正确性的唯一证明。
- 完成组件任务前，记录 unit、integration、E2E 和 package 是否适用及理由，并运行测试类型检查和所有受影响命令。

关键视觉契约由 Vitest Browser Mode 中聚焦的布局、尺寸和计算样式断言验证。只有具备稳定组件视觉、版本化基线、固定渲染环境和明确差异审查流程后，才考虑恢复截图回归。

## Storybook 边界

Storybook 仅作为开发期源码预览、交互调试和组件文档工作台。Stories、Docs、Controls、Actions、Viewport 和 `play` 可以帮助人工复现行为，但不属于自动化测试金字塔，也不进入发布质量门槛。公共组件行为必须由适用的 unit、integration 或 E2E 独立验证。

## 运行入口

```bash
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test:package
```

`pnpm test:e2e` 和 `pnpm test:package` 都会先生成新鲜构建产物，适合独立运行。`pnpm quality` 在快速 `check` 后运行 integration，只构建一次，再复用该产物执行 E2E 与 package 契约检查。
