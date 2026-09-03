## Why

当前 TypeScript 与 Vitest 配置按历史需要逐步增加，测试项目、文件边界、路径别名和 Vue 插件存在重复定义，导致维护者难以判断配置职责，也增加新增测试层或调整目录时产生漂移的风险。需要在不改变构建产物、测试分层和质量门槛的前提下，按工具消费边界收敛配置来源。

## What Changes

- 将根 `tsconfig.json` 明确为组件库源码类型检查配置，并精简与其输入范围无关的文件声明。
- 由 `tsconfig.build.json`、`tsconfig.storybook.json` 和 `tests/tsconfig.json` 分别描述声明构建、Storybook 与测试环境，同时将 `tests/tsconfig.json` 作为唯一测试 TypeScript 配置。
- 保留根目录 `vite.config.ts` 作为 Vite 自动发现的构建配置，将其纳入工具配置的静态类型检查范围，而不是作为组件库源码输入。
- 使用 Vitest projects 在单个 `vitest.config.ts` 中定义 `unit` 与 `browser` 两个项目，删除重复的浏览器专用 Vitest 配置。
- 调整 npm scripts 与测试文档，使各质量命令指向新的配置入口，并保持 `pnpm test` 默认只执行快速单元测试。
- 删除不再需要的 `vitest/globals` 类型注入，继续要求测试显式导入 Vitest API。
- 不合并 Vite、Vitest、Playwright、Storybook、ESLint 和 Prettier 之间仅表面相似但职责不同的设置。

## Capabilities

### New Capabilities

无。本变更仅重构项目工具配置，不引入新的产品或质量能力。

### Modified Capabilities

无。现有 `ui-quality-pipeline` 的测试层级、运行结果和统一质量入口保持不变。

## Impact

- 受影响文件：根目录及 `tests/` 下的 TypeScript 配置、Vitest 配置、`package.json` 测试与类型检查脚本、测试维护文档。
- 计划删除：`tsconfig.test.json`、`vitest.browser.config.ts`。
- 保留且不会删除：`vite.config.ts`；Vite 继续自动读取该文件。
- 对外 API、组件行为、构建产物格式和运行时依赖均不变。
- 实施后需要验证类型检查、两类 Vitest 测试、组件库构建和 Storybook 构建，以确认配置收敛没有缩小检查范围。
