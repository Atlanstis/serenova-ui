## Why

Storybook 当前只承担开发过程中的组件预览与交互验证，但仓库同时维护源码、构建产物和静态站点等多套命令与配置，增加了理解成本和重复构建。需要收敛脚本入口，让开发、质量检查和发布验证各自只有清晰且必要的路径。

## What Changes

- 将 `dev` 作为唯一的 Storybook 开发预览入口，移除 `storybook`、`storybook:dist` 和 `dev:dist` 等重复或不再适用的入口
- 移除 Storybook 静态站点构建命令，以及仅为静态构建和 dist 预览服务的模式切换、输出目录忽略配置与现有生成目录
- 移除与 `test:preview` 重复的 `test:e2e` 兼容别名，统一以预览集成测试描述 Storybook 验证职责
- 按日常开发、构建、聚合质量检查、单项检查、测试、发布和生命周期钩子的优先级重排 scripts
- 让 `quality` 复用快速 `check`，并让 `test:package` 自行构建后验证发布产物，避免依赖隐含的前置构建
- 更新项目与测试文档，使命令说明、Storybook 定位和质量链与精简后的入口一致

## Capabilities

### New Capabilities

无。

### Modified Capabilities

- `component-preview`：将 Storybook 明确限定为源码开发预览与预览集成测试工作台，移除构建产物预览要求

## Impact

- 影响 `package.json` 中的开发、Storybook、测试、质量和发布相关 scripts
- 影响 Playwright 启动 Storybook 的命令，以及 `.storybook/main.ts` 中的 dist 模式实现
- 影响 `.gitignore`、`.prettierignore`、ESLint 配置中的 Storybook 静态输出目录规则，并删除现有 `storybook-static/` 与 `storybook-static-dist/` 目录
- 影响 README 与测试工作区文档中的命令清单和职责说明
- 删除的命令入口属于维护者工作流变更；组件库运行时 API、npm 导出和发布产物格式不变
