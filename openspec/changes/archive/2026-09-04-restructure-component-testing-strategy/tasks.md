## 1. 建立迁移基线

- [x] 1.1 运行 `pnpm type-check:test`、`pnpm test:unit`、`pnpm test:browser`、`pnpm test:preview` 和 `pnpm test:package`，记录当前各运行器发现的文件与用例数量，确认后续迁移可以逐项对照
- [x] 1.2 检查仓库内所有 `browser`、`preview`、Storybook Playwright helper 与质量命令引用，形成待迁移清单，并通过 `rg` 确认配置、脚本、测试和文档均已纳入

## 2. 将真实浏览器测试迁移为集成层

- [x] 2.1 将 Vitest Browser Mode project、测试发现后缀和 setup 命名从 `browser` 调整为 `integration`，并通过配置解析确认 unit 与 integration 文件模式互斥
- [x] 2.2 将现有 `*.browser.spec.ts` 及相关 Fixture 引用迁移为 `*.integration.spec.ts`，运行迁移后的集成测试并与基线核对用例数量和行为结果
- [x] 2.3 在 `package.json` 提供 `test:integration` 并移除失去规范意义的 `test:browser` 入口，通过分别运行 `pnpm test:unit` 与 `pnpm test:integration` 确认两层可独立执行

## 3. 建立构建产物消费应用 E2E

- [x] 3.1 在 `tests/e2e/fixtures/consumer-app/` 创建最小 Vue 消费应用，使应用代码只从 `serenova-ui` 和 `serenova-ui/style.css` 导入，并通过 Vite 测试配置将公共入口精确映射到 `dist` 后验证应用可启动
- [x] 3.2 为消费应用建立至少一条代表性 `*.e2e.spec.ts` 用户流程，验证构建产物的公共安装、样式加载与可观察交互结果，并通过 Playwright Chromium 单独运行该流程
- [x] 3.3 将 `playwright.config.ts` 改为发现 E2E 用例并启动最小消费应用，提供可独立获得新鲜构建产物的 `test:e2e` 命令，通过清空或更新产物后运行该命令确认不会消费陈旧构建
- [x] 3.4 删除 `tests/integration/storybook/environment.preview.spec.ts` 与只服务该测试的 Storybook helper，移除 `test:preview` 入口，并通过 `rg "preview\.spec|test:preview|support/playwright/storybook"` 确认生效代码和文档不存在遗留引用

## 4. 保持发布契约与质量入口独立

- [x] 4.1 保持 `tests/contracts/package/` 对 ESM、CommonJS、类型声明、CSS、插件、导出映射、Vue external 和 npm 文件边界的独立验证，运行 package smoke 确认迁移未把这些职责移入 E2E
- [x] 4.2 调整 `quality` 的执行链，使其在 `check` 后运行 integration、一次新鲜构建、E2E 和 package 契约检查，并通过命令输出确认聚合路径不重复构建且任一步失败都会返回非零状态
- [x] 4.3 保持 `check` 只执行格式、Lint、类型检查和 unit，通过运行 `pnpm check` 确认不会启动 Chromium、Playwright webServer 或消费应用构建

## 5. 更新代理规范与维护文档

- [x] 5.1 重写 `AGENTS.md` 的“组件测试规范”，明确 unit 必选范围、integration 触发条件、基于 `dist` 的代表性 E2E、独立 package 契约、Storybook 非自动化职责及各层适用性记录要求，并将轻量化无障碍章节的 `*.browser.spec.ts` 同步改为 `*.integration.spec.ts` 后逐条核对无冲突表述
- [x] 5.2 更新 `tests/README.md` 的目录结构、文件命名、测试矩阵、层级选择规则和运行命令，通过文档中的所有路径与 `package.json` scripts 对照确认一致
- [x] 5.3 更新根 `README.md` 的测试分层、质量命令和 Storybook 定位，移除 preview 自动化描述，并通过执行文档列出的非发布测试命令确认入口有效
- [x] 5.4 更新 `component-preview` 主规格的 Purpose，使其不再声称通过预览集成测试验证开发环境，并通过 `openspec validate restructure-component-testing-strategy --strict` 确认主规格与变更增量语义一致

## 6. 完整验证

- [x] 6.1 运行 `pnpm format:check`、`pnpm lint` 和 `pnpm type-check`，确认测试目录、消费应用、配置与文档变更通过静态质量检查
- [x] 6.2 分别运行 `pnpm test:unit`、`pnpm test:integration`、`pnpm test:e2e` 和 `pnpm test:package`，记录每层覆盖对象、用例结果与构建产物来源
- [x] 6.3 运行 `pnpm quality`，确认完整质量入口覆盖 unit、integration、E2E 和独立 package 契约测试，且不启动 Storybook
- [x] 6.4 运行 `openspec validate restructure-component-testing-strategy --strict` 并检查最终 `git diff`，确认 OpenSpec 制品、`AGENTS.md` 与实际配置使用同一测试术语且没有误改组件公共 API
