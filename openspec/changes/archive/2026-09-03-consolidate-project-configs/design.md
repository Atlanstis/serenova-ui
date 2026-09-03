## Context

参见 `proposal.md` 的 Why。当前仓库同时维护四份 TypeScript 配置和一份位于 `tests/` 的编辑器配置；其中根 `tsconfig.test.json` 与 `tests/tsconfig.json` 表达同一个测试项目。两份 Vitest 配置则分别运行 happy-dom 单元测试和 Chromium 浏览器组件测试，但重复声明 Vue 插件与 `@` 路径别名。

必须保留以下约束：

- `vite.config.ts` 位于仓库根目录，继续由 Vite 自动发现并驱动组件库构建。
- 源码、声明构建、Storybook 和测试具有不同的 TypeScript 文件边界。
- 单元测试与浏览器测试仍可独立运行，`pnpm test` 仍只运行快速单元测试。
- Playwright 的 Storybook 集成测试与视觉测试不并入 Vitest。
- 配置重构不得改变 npm 包入口、构建产物或现有质量门槛。

## Goals / Non-Goals

**Goals:**

- 让每个 TypeScript 配置对应一个清晰的消费环境，并移除测试配置的双重来源。
- 让 Vitest 的共享 Vite 配置只声明一次，同时保留 unit/browser 的运行边界。
- 保证所有被迁移的配置文件仍接受静态类型检查。
- 通过保持命令名称与默认行为稳定，降低迁移对维护者和 CI 的影响。

**Non-Goals:**

- 不引入新的配置共享依赖，例如 `vite-tsconfig-paths` 或声明生成插件。
- 不统一不同工具中含义相近的浏览器选项、忽略目录或路径映射。
- 不调整测试用例目录、测试职责、Storybook 行为或构建输出结构。
- 不将项目改造成 TypeScript project references 或 monorepo 配置体系。

## Decisions

### 1. 保留四个按消费环境划分的 TypeScript 配置

最终保留：

```text
tsconfig.json
├── tsconfig.build.json
├── tsconfig.storybook.json
└── tests/tsconfig.json
```

根 `tsconfig.json` 继续是组件库源码的开发类型检查入口，包含 `src`，并排除 Story 与测试文件。`src/bundle-entry.ts` 仍由该配置执行无输出类型检查，保证打包入口本身没有类型错误。`vite.config.ts` 从该配置的 `include` 移出，因为它不是组件库源码。

`tsconfig.build.json` 继续继承根配置和 `@vue/tsconfig/tsconfig.lib.json`，只补充声明输出设置，并排除不应发布的 Story、测试和 `bundle-entry.ts`。TypeScript 的 `include` 与 `exclude` 数组不会合并，因此为保持精确的声明输出边界，少量 glob 重复是有意保留的。

`tsconfig.storybook.json` 继续负责 Storybook 配置、Stories 和其引用的源码；只保留实际影响该输入集合的排除规则及 `serenova-ui` 开发期路径映射。

`tests/tsconfig.json` 直接取代根 `tsconfig.test.json`，同时服务编辑器自动发现和 `type-check:test`。它包含源码、测试 Fixture、`vite.config.ts`、统一后的 `vitest.config.ts` 与 `playwright.config.ts`，从而在配置文件移出源码项目后仍检查其类型。

没有采用新增 `tsconfig.base.json` 或 `tsconfig.tools.json` 的方案：当前是单包仓库，这会用更多配置文件换取很少的复用收益。也没有删除 `tests/tsconfig.json`，因为其目录位置可帮助编辑器将测试文件稳定归入正确的 TypeScript 项目。

### 2. 测试代码显式导入 API，不注入 Vitest 全局类型

从 `tests/tsconfig.json` 移除 `vitest/globals`，保留 `node` 与 `vite/client`。当前 Vitest 测试均从 `vitest` 显式导入 `describe`、`test`、`expect` 等 API，因此全局类型没有提供必要能力，反而会让同一 TypeScript 项目内的 Playwright 文件错误地获得 Vitest 全局名称。

源码仍会由根 `tsconfig.json` 独立检查，因此测试项目所需的 Node 类型不会削弱组件库源码的环境边界。

### 3. 使用一个 Vitest 配置承载两个命名项目

`vitest.config.ts` 在顶层只声明一次 Vue 插件与 `@` alias，并通过 Vitest 4 的 `test.projects` 定义：

- `unit`：匹配 `tests/unit/**/*.spec.ts`，使用 happy-dom 和单元测试 setup。
- `browser`：匹配 `tests/browser/**/*.browser.spec.ts`，使用现有 Playwright provider、Chromium 实例、视口、区域设置、时区和浏览器 setup。

两个项目使用明确名称，npm scripts 分别通过 `vitest run --project unit` 与 `vitest run --project browser` 执行。这样删除 `vitest.browser.config.ts` 后仍保持独立运行和故障定位能力。

没有把 Vitest 配置合并进 `vite.config.ts`：构建与测试的生命周期和消费入口不同，独立文件能避免测试项目设置进入打包配置。也没有把 Playwright 合并进 Vitest，因为它承担 Storybook 预览集成和视觉回归，而不是组件级浏览器测试。

### 4. 保持公开命令语义稳定

`type-check:test` 改为读取 `tests/tsconfig.json`；`test:unit` 与 `test:browser` 改为按 Vitest project 名称执行。`test`、`check`、`quality` 和 `prepublishOnly` 的组合关系保持不变。

尤其保留 `test` 默认指向 `test:unit`，避免常规测试命令因为配置合并而隐式启动 Chromium。完整质量入口仍显式运行两类 Vitest 测试。

### 5. 只消除同一职责内部的重复

Vitest 两个项目共享 Vue 插件与 alias，因为它们由同一配置解析器消费。以下相似配置不抽取：

- Vitest Browser 与 Playwright 的 locale、timezone、colorScheme 和 viewport。
- TypeScript paths、Vite alias 与 Storybook 的包入口 alias。
- ESLint、Prettier 与各构建工具的 ignore。

这些内容属于不同工具的独立契约；跨工具共享常量会增加加载约束，也可能错误地绑定原本可独立演进的环境。

## Risks / Trade-offs

- [Vitest projects 合并配置时发生继承差异] → 为两个项目设置唯一名称和互斥 include，并分别执行现有测试命令验证解析结果。
- [精简 TypeScript glob 后漏检文件] → 迁移前后使用 `vue-tsc --showConfig` 对比实际文件集合，并运行三个类型检查入口。
- [删除根测试配置后编辑器未识别测试项目] → 保留 `tests/tsconfig.json` 在测试目录内，并使 CLI 与编辑器共同消费它。
- [移出源码项目后遗漏 Vite 配置类型错误] → 将 `vite.config.ts` 显式加入 `tests/tsconfig.json`，同时以 `vite build` 验证真实加载。
- [统一 Vitest 配置使默认命令意外执行全部项目] → 所有脚本显式传递 `--project`，并保持 `pnpm test` 指向 `test:unit`。
- [配置行数下降有限] → 优先减少所有权重复而不是追求最少文件数；不同运行环境仍保留独立边界。

## Migration Plan

1. 记录当前各 TypeScript 配置解析出的文件集合，并运行现有快速检查作为基线。
2. 将根测试配置内容迁入 `tests/tsconfig.json`，精简其他 TypeScript 配置并更新脚本。
3. 将 unit/browser 定义迁入单个 `vitest.config.ts`，更新脚本后删除旧浏览器配置。
4. 更新测试维护文档中的配置说明与命令解释。
5. 运行格式检查、Lint、全部类型检查、两个 Vitest 项目、组件库构建和两种 Storybook 构建；必要时再执行完整质量入口。
6. 对比迁移前后的 TypeScript 实际文件集合，确认没有意外缩小覆盖范围。

若迁移验证失败，可恢复被删除的两份配置及原脚本引用；变更不涉及数据、外部 API 或不可逆迁移。
