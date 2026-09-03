# 测试范围与目录约定

本目录集中保存仓库的自动化测试、Fixture、截图基线和测试辅助。组件实现与 Story 保留在 `src/`，测试按验证层级组织，再按组件或共享领域拆分。

## 功能范围

| 目录       | 运行器                              | 职责边界                                                                                      | 当前覆盖                                                   |
| ---------- | ----------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `unit/`    | Vitest + happy-dom + Vue Test Utils | 快速验证公共 Props、Slots、Events、渲染输出、状态变化、类型与纯逻辑；不依赖真实布局和计算样式 | Button 公共行为、公共类型、组件/插件导出、`withInstall`    |
| `browser/` | Vitest Browser Mode + Chromium      | 验证 DOM 模拟环境无法可靠覆盖的原生表单、布局和计算样式                                       | Button 禁用/加载、submit/reset、block 宽度                 |
| `preview/` | Playwright + Storybook              | 验证 Story 自动发现、全局参数、视口和 `play` 交互，保证预览环境可用于开发与文档               | Button Stories、主题、RTL、移动端视口、交互结果            |
| `visual/`  | Playwright 截图断言                 | 对稳定且有回归价值的状态矩阵做视觉比较；不替代行为断言                                        | Button 视觉变体、尺寸与状态矩阵                            |
| `package/` | Node.js + TypeScript                | 构建后从使用者视角验证 `dist`、导出映射和 npm 包内容；不读取组件内部实现                      | ESM、CommonJS、CSS、声明、默认插件、具名组件、Vue external |

`helpers/` 保存跨 Playwright 测试复用的纯辅助，`setup/` 保存 Vitest 环境初始化。只服务单个测试文件的 Fixture 应与该测试共置，例如 `browser/button/ButtonBrowserFixture.vue`。

`tests/tsconfig.json` 是唯一的测试 TypeScript 项目，继承根 `tsconfig.json` 的编译基线与源码别名，并同时覆盖测试文件和 Vite、Vitest、Playwright 配置。编辑器可在测试目录就近发现它，命令行通过 `pnpm type-check:test` 使用同一配置。测试 API 均从对应运行器显式导入，不依赖 Vitest 全局类型。

`vitest.config.ts` 统一定义 `unit` 和 `browser` 两个命名项目，共享 Vue 插件与源码别名；`pnpm test:unit` 和 `pnpm test:browser` 分别选择对应项目。根目录 `vite.config.ts` 独立负责组件库构建，继续由 Vite 自动读取。

## 用例放置规则

- 所有自动化测试统一放在 `tests/`，不在 `src/` 下创建 `tests` 或 `__tests__` 目录。
- 单元测试使用 `tests/unit/<领域>/*.spec.ts`；真实浏览器组件测试使用 `tests/browser/<领域>/*.browser.spec.ts`。
- Playwright 只发现 `preview/` 和 `visual/`，不会误执行 Vitest 用例。
- 优先断言用户可观察的输出、事件和语义；不访问组件内部响应式状态或私有方法。
- 所有异步交互都等待 `trigger`、`setValue` 或浏览器操作完成；外部 Promise 使用 `flushPromises`。
- 完整 HTML 快照不能作为正确性的唯一证据；视觉截图仅覆盖稳定状态，并与行为测试配套。
- 新增公共组件时，至少补充 `unit/<组件>`；涉及真实浏览器行为时补充 `browser/<组件>`；稳定视觉状态再进入对应 Playwright 层。

## 运行入口

```bash
pnpm test:unit
pnpm test:browser
pnpm test:preview
pnpm test:visual
pnpm test:package
```

`pnpm test:e2e` 汇总 Storybook 预览和视觉回归；`pnpm quality` 执行发布前完整质量门槛。视觉基线仅在确认变更符合预期后更新。
