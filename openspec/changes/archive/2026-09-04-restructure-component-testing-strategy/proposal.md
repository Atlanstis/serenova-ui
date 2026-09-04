## Why

当前 Playwright 测试只验证用于开发调试的 Storybook 环境，无法证明组件库构建产物在真实消费应用中的安装、样式和关键交互流程可用。后续组件需要一套职责明确的单元测试、真实浏览器集成测试和消费应用 E2E 测试范围，同时保留独立的发布包契约验证。

## What Changes

- 将组件质量验证明确划分为快速单元测试、按契约触发的真实浏览器集成测试，以及基于构建产物和最小消费应用的代表性 Playwright E2E 测试
- 将现有 `*.browser.spec.ts` 语义调整为 `*.integration.spec.ts`，使测试名称表达验证层级而非执行环境
- 使用 Playwright E2E 验证全量或按需安装、公共样式加载及跨组件关键用户流程，首阶段只要求 Chromium，且不要求每个组件单独具有 E2E
- 删除 Storybook 环境 Playwright 测试及其专用辅助代码；Storybook 继续作为开发预览、交互调试和文档工作台，并保留静态类型检查
- 保留构建产物发布契约测试，独立验证 ESM、CommonJS、类型声明、CSS、导出映射和 npm 文件边界
- 调整质量命令，使日常 `check` 运行快速单元测试，完整 `quality` 运行单元、集成、E2E 和发布契约测试
- 更新 `AGENTS.md`、测试说明和项目文档，使自动化代理能从组件公共契约选择适用测试层并记录验证结论

## Capabilities

### New Capabilities

无。

### Modified Capabilities

- `ui-quality-pipeline`：重定义组件测试层级、选择条件、E2E 消费载体、发布契约边界及质量命令组成
- `component-preview`：移除 Storybook 预览自动化测试职责，将 Storybook 收敛为开发预览、调试和文档工作台

## Impact

- 测试目录与文件命名：`tests/components/`、`tests/e2e/`、`tests/contracts/`、`tests/support/`
- 测试配置与命令：`vitest.config.ts`、`playwright.config.ts`、`package.json`
- 开发工作台测试：删除 `tests/integration/storybook/environment.preview.spec.ts` 和专用 Storybook Playwright helper
- 新增最小消费应用 Fixture，用于加载构建后的 `dist` 并承载代表性 E2E 流程
- 贡献者与维护文档：`AGENTS.md`、`tests/README.md`、根 `README.md`
- 不改变组件公共 API，也不要求新增运行时依赖
