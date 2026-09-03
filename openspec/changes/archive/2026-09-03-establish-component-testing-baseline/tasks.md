## 1. 建立迁移基线

- [x] 1.1 运行 `pnpm type-check:test`、`pnpm test:unit`、`pnpm test:browser`、`pnpm test:preview` 以及 `pnpm build && pnpm test:package`，记录迁移前结果、各运行器实际发现的用例和截图基线状态，形成可对照基线
- [x] 1.2 核对现有测试、Fixture、setup、helper、空目录和所有脚本引用，形成从旧路径到设计目标路径的一一映射，并通过 `rg --files tests` 与配置引用结果确认每项资产具有明确归属

## 2. 重组测试工作区

- [x] 2.1 建立 `tests/support/vitest` 与 `tests/support/playwright`，迁移 unit/browser setup 和 Storybook helper，更新引用后通过文件清单确认 support 资产统一使用 setup 或 helper 命名
- [x] 2.2 将 Button 的快速测试、浏览器测试和局部 Fixture 聚合到 `tests/components/button`，按 `*.unit.spec.ts`、`*.browser.spec.ts` 与 `*.fixture.vue` 规则重命名，并通过测试清单确认原有行为、导出、类型和浏览器场景均有对应文件
- [x] 2.3 将 `withInstall` 测试迁移到 `tests/shared`，将 Storybook 预览测试迁移到 `tests/integration/storybook`，将包冒烟及消费 Fixture 迁移到 `tests/contracts/package`，更新相对导入和仓库根路径计算后确认所有目标文件可被解析
- [x] 2.4 删除迁移后为空的旧层级目录，并通过 `find tests -type d -empty` 和 `rg --files tests` 确认工作区只保留有职责的目录

## 3. 调整运行器与命令

- [x] 3.1 将 Vitest unit/browser projects 分别改为发现 `tests/**/*.unit.spec.ts` 与 `tests/**/*.browser.spec.ts`，更新 setup 路径后运行 `pnpm test:unit` 和 `pnpm test:browser`，确认两个项目互斥且用例数量与迁移基线一致
- [x] 3.2 更新 `tests/tsconfig.json` 的包契约排除路径及 `eslint.config.js` 的 Node 文件匹配路径，运行 `pnpm type-check:test` 与 `pnpm lint`，确认测试、Vue Fixture、根配置和 Node 冒烟脚本均处于正确环境
- [x] 3.3 将 Playwright 收敛为仅发现 `*.preview.spec.ts`，删除截图断言专用配置，更新 `test:preview` 并保留 `test:e2e` 作为兼容别名；分别运行两个命令并确认它们只执行 Storybook 预览集成测试
- [x] 3.4 更新 `test:package` 和统一 `quality` 入口，使其使用新的包契约路径并显式执行预览集成而非视觉截图；运行 `pnpm build && pnpm test:package`，确认 ESM、CommonJS、CSS、声明、公共组件和 Vue external 仍可从构建产物消费

## 4. 承接关键视觉契约

- [x] 4.1 在 Button 浏览器 Fixture 与测试中补充少量面向公共契约的计算样式和尺寸断言，覆盖代表性变体、尺寸、禁用状态与加载指示器，并运行 `pnpm test:browser` 确认这些断言在 Chromium 中稳定通过
- [x] 4.2 删除 Button Playwright 截图用例和 `test:visual` 脚本，通过 `rg "toHaveScreenshot|test:visual|tests/visual|\.visual\.spec"` 确认生效代码与文档的匹配结果为零，同时确认 Playwright 和 Chromium 依赖继续服务 preview 与 browser 测试

## 5. 固化后续组件测试基准

- [x] 5.1 在 `AGENTS.md` 增加“组件测试规范”，写明公共契约优先、unit 必需、browser 条件触发、公共导出、Fixture 归属、结构快照配套要求和完成定义，并通过人工核对确认每项规则均为正向必须项且测试范围由组件自身公共契约推导
- [x] 5.2 更新 `tests/README.md`，说明组件领域优先的目录、四类资产职责、后缀发现协议、测试层选择方法、条件层省略说明和截图回归恢复前提，并逐项核对文档路径与实际文件一致
- [x] 5.3 更新根 `README.md` 的项目结构、测试矩阵、运行命令与质量入口，移除视觉基线更新说明并解释 `test:e2e` 的兼容别名，通过执行文档列出的非发布命令确认没有失效入口

## 6. 完整验证

- [x] 6.1 运行 `pnpm format:check`、`pnpm lint`、`pnpm type-check`、`pnpm test:unit`、`pnpm test:browser`、`pnpm test:preview`、`pnpm build:storybook`、`pnpm build:storybook:dist` 和 `pnpm build && pnpm test:package`，确认各层独立验证全部通过
- [x] 6.2 运行 `pnpm quality` 与兼容入口 `pnpm test:e2e`，确认统一质量门槛执行类型检查、unit、browser、preview、构建和 package 必需步骤，且任一必需检查失败都会返回非零状态
- [x] 6.3 使用 `git diff --check`、最终测试文件清单和全仓路径搜索复核迁移，确认所有测试资产均归入目标目录并由对应运行器与类型检查覆盖
