## Why

当前测试目录同时混用运行器层级、测试对象和基础设施三种分类方式，同一组件的测试分散在多个目录，截图回归也缺少版本化基线与固定 CI 环境。随着公共组件增加，这会放大用例放置、完成标准和维护成本的不确定性，因此需要在扩展组件库前建立统一、可执行的组件测试基准。

## What Changes

- 将 `tests/` 明确为独立测试工作区：测试用例按组件或系统职责聚合，运行环境通过文件后缀区分，公共 setup、helper 与 Fixture 具有明确归属。
- 为所有后续公共组件建立通用完成基准，要求从每个组件自身的公共契约推导 Props、Slots、Events、语义、状态与边界条件覆盖范围。
- 明确真实浏览器测试的触发条件；原生行为、焦点与键盘交互、布局、视口或计算样式属于公共契约时必须由 Vitest Browser Mode 验证。
- 以少量稳定的真实浏览器断言取代 Playwright 截图回归和版本化截图基线；未来在具备稳定设计、固定执行环境和基线审查机制后，通过独立提案恢复截图回归。
- 保留 Playwright 驱动的 Storybook 预览集成测试，以及构建产物和发布包消费契约测试。
- 在 `AGENTS.md` 增加面向自动化编码代理的组件测试规则、分层选择标准和组件完成定义，使后续组件开发统一遵循该基准。
- 迁移现有 Button、共享辅助、Storybook 预览和包级测试作为目录与命名规则的验证样例，并同步测试文档、命令和配置。

## Capabilities

### New Capabilities

无。

### Modified Capabilities

- `ui-quality-pipeline`：将质量门槛从强制截图回归调整为按公共契约选择测试层，并增加适用于所有公共组件的测试完成基准与测试工作区约定。

## Impact

- 受影响目录与配置：`tests/`、`vitest.config.ts`、`playwright.config.ts`、`tests/tsconfig.json`、`eslint.config.js`、`package.json`。
- 受影响文档与代理规则：`AGENTS.md`、根 `README.md`、`tests/README.md`。
- 受影响规格：`openspec/specs/ui-quality-pipeline/spec.md`。
- 组件公共 API、构建产物格式、Vue peer dependency 与 Storybook 的源码/产物预览能力保持原有契约。
- Playwright 与 Chromium 继续用于预览集成测试和 Vitest Browser Mode。
