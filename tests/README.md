# 测试工作区与组件测试基准

本目录集中保存自动化测试、局部 Fixture、包消费样例和共享测试基础设施。组件实现与 Story 保留在 `src/`，测试按组件或系统职责聚合，运行环境通过文件后缀标识。

## 目录结构

```text
tests/
├── components/                    # 公共组件测试与局部 Fixture
│   └── <component>/
│       ├── behavior.unit.spec.ts
│       ├── native.browser.spec.ts
│       └── fixtures/
├── shared/                        # 共享源码测试
├── integration/storybook/         # Storybook 预览集成测试
├── contracts/package/             # 构建产物与包消费契约
├── support/
│   ├── vitest/                    # Vitest setup
│   └── playwright/                # Playwright helper
└── tsconfig.json                  # 测试 TypeScript 项目
```

| 目录           | 职责                                             | 当前覆盖                                        |
| -------------- | ------------------------------------------------ | ----------------------------------------------- |
| `components/`  | 按公共组件聚合快速测试、浏览器测试和局部 Fixture | Button 行为、类型、导出、原生行为与关键计算样式 |
| `shared/`      | 验证共享源码公共契约                             | `withInstall`                                   |
| `integration/` | 验证跨组件或开发环境集成                         | Storybook 发现、主题、RTL、视口和 `play` 交互   |
| `contracts/`   | 从外部使用者视角验证构建产物                     | ESM、CommonJS、CSS、声明、插件和 Vue external   |
| `support/`     | 保存跨领域复用的 setup 与 helper                 | Vitest 环境初始化和 Storybook URL 辅助          |

`tests/tsconfig.json` 是唯一的测试 TypeScript 项目，继承根 `tsconfig.json` 的编译基线与源码别名，并覆盖测试文件、Vue Fixture 和 Vite、Vitest、Playwright 配置。包消费 Fixture 由包冒烟脚本使用独立 TypeScript 命令验证。

## 文件命名与运行器

| 后缀                | 运行器                              | 验证目标                                                    |
| ------------------- | ----------------------------------- | ----------------------------------------------------------- |
| `*.unit.spec.ts`    | Vitest + happy-dom + Vue Test Utils | 公共 Props、Slots、Events、渲染结果、状态变化、类型和纯逻辑 |
| `*.browser.spec.ts` | Vitest Browser Mode + Chromium      | 原生 DOM 行为、焦点、键盘、布局、视口和计算样式             |
| `*.preview.spec.ts` | Playwright + Storybook              | Story 发现、预览参数和 `play` 交互集成                      |
| `*.fixture.*`       | 对应测试或脚本                      | 局部渲染载体与消费样例                                      |

`vitest.config.ts` 使用两个命名 project 按后缀发现 unit 与 browser 用例；`playwright.config.ts` 发现 preview 用例。测试 API 必须从对应运行器显式导入。

## 组件测试基准

- 新增或修改公共组件时，必须从该组件自身的 Props、默认值、Slots、Events、渲染结果、状态变化、边界条件和公共导出推导测试范围。
- 每个公共组件必须具有 `components/<组件领域>/*.unit.spec.ts` 快速黑盒测试。
- 公共契约涉及原生表单、焦点与键盘、浏览器事件、Teleport、滚动与溢出、响应式布局、元素尺寸或计算样式时，必须增加 `*.browser.spec.ts`。
- 公共出口或类型发生变化时，必须同步更新源码出口测试和 `contracts/package/package-consumer.fixture.ts`。
- 单个组件或用例使用的 Fixture 必须与所属测试共置；跨领域复用的资产必须提升到 `support/`。
- 所有异步交互必须等待 `trigger`、`setValue` 或浏览器操作完成；外部 Promise 必须使用 `flushPromises` 等待完成。
- 结构快照投入使用时必须与明确行为断言配套。
- 组件任务完成前必须运行测试类型检查和受影响的质量命令，并记录测试层选择与验证结果。

当前视觉契约由 Vitest Browser Mode 中聚焦的布局、尺寸和计算样式断言验证。未来恢复截图回归时，必须具备稳定组件视觉、版本化基线、固定浏览器与渲染环境，以及明确的差异审查流程。

## 运行入口

```bash
pnpm test:unit
pnpm test:browser
pnpm test:preview
pnpm test:package
```

Storybook 仅作为开发过程中的源码预览和 `pnpm test:preview` 的集成测试宿主，不生成或交付静态站点。`pnpm test:package` 会先构建组件库再验证发布产物；`pnpm quality` 复用快速 `check`，并继续执行 browser、preview 和 package 冒烟组成的发布前完整质量门槛。
