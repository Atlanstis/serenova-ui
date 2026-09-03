## 1. 建立迁移基线

- [x] 1.1 运行现有 `pnpm type-check`、`pnpm test:unit` 和 `pnpm test:browser`，记录迁移前结果并确认当前配置可作为对照基线。
- [x] 1.2 使用 `vue-tsc --showConfig` 记录源码、构建、Storybook、根测试配置和 `tests/tsconfig.json` 的实际文件集合，验证后续对比具有完整基线。

## 2. 收敛 TypeScript 配置

- [x] 2.1 精简根 `tsconfig.json` 的输入范围，保留组件库源码和 `src/bundle-entry.ts` 的类型检查、移出 `vite.config.ts`，并通过 `vue-tsc --noEmit -p tsconfig.json` 验证源码项目。
- [x] 2.2 精简 `tsconfig.build.json` 与 `tsconfig.storybook.json` 中无效的 include/exclude 项，同时保持声明输出和 Storybook 文件边界；分别通过 `vue-tsc -p tsconfig.build.json --showConfig` 与 `vue-tsc --noEmit -p tsconfig.storybook.json` 验证。
- [x] 2.3 将 `tsconfig.test.json` 的有效配置迁入 `tests/tsconfig.json`，包含源码、测试、`vite.config.ts`、`vitest.config.ts` 和 `playwright.config.ts`，移除 `vitest/globals` 并通过 `vue-tsc --noEmit -p tests/tsconfig.json` 验证所有显式导入。
- [x] 2.4 更新 `type-check:test` 使用 `tests/tsconfig.json` 后删除根 `tsconfig.test.json`，运行 `pnpm type-check` 并对比迁移前后 `--showConfig` 文件集合，确认没有意外漏检。

## 3. 合并 Vitest 项目配置

- [x] 3.1 在 `vitest.config.ts` 顶层保留单一 Vue 插件与 `@` alias，并定义互斥的 `unit` 和 `browser` projects；通过 Vitest 配置解析或测试输出确认两个项目名称和文件匹配范围正确。
- [x] 3.2 将原 `vitest.browser.config.ts` 的 Playwright provider、Chromium、视口、区域设置、时区和 setup 完整迁入 `browser` project，运行 `pnpm test:browser` 验证真实浏览器组件测试。
- [x] 3.3 更新 `test:unit` 与 `test:browser` 脚本以使用 `--project`，保持 `test` 仍只委托 `test:unit`，删除 `vitest.browser.config.ts` 后分别运行 `pnpm test` 和 `pnpm test:browser` 验证命令语义。

## 4. 文档与完整验证

- [x] 4.1 更新 `tests/README.md` 中的 TypeScript 项目和 Vitest 配置说明，核对文档列出的命令、配置文件名与仓库实际内容一致。
- [x] 4.2 运行 `pnpm lint`、`pnpm format:check`、`pnpm type-check`、`pnpm test:unit`、`pnpm test:browser` 和 `pnpm build`，确认静态检查、两类组件测试与发布构建全部通过。
- [x] 4.3 运行 `pnpm build:storybook` 与 `pnpm build:storybook:dist`，确认源码模式和产物模式 Storybook 均未受配置重构影响。
- [x] 4.4 检查最终配置文件和 npm scripts，确认 `vite.config.ts` 仍位于根目录、Vite 构建会自动读取它，且仅删除计划中的 `tsconfig.test.json` 与 `vitest.browser.config.ts`。
