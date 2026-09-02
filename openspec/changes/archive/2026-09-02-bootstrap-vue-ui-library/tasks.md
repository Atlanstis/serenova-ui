## 1. 开发与测试基础设施

- [x] 1.1 添加 Vitest、Vue Test Utils、DOM 模拟环境、Vitest Browser Playwright Provider、Vue 浏览器渲染适配和 Playwright 等开发依赖及对应脚本，并验证 `pnpm install --frozen-lockfile` 成功。
- [x] 1.2 创建快速测试、浏览器测试和 Playwright 测试的独立配置与公共 setup，验证各测试命令在无匹配用例时能够完成配置加载且不出现 Vue/Vite 转换错误。
- [x] 1.3 调整 TypeScript 配置，使库声明构建排除 `tests`、Story 和 `.storybook`，同时 Storybook 与测试代码仍参与各自的类型检查，并通过对应类型检查命令验证边界。
- [x] 1.4 建立 `src/shared`、组件领域目录、`src/styles`、`.storybook` 和顶层测试目录，移除被替代的手写 `playground`，验证目录与配置引用一致且 `pnpm lint` 不报告无效路径。

## 2. Button 与公共组件基础

- [x] 2.1 实现带完整泛型类型的 `withInstall` 辅助函数，验证一个测试组件可单独通过 `app.use()` 注册且 TypeScript 推断保留原组件类型。
- [x] 2.2 定义并导出 `ButtonVariant`、`ButtonSize`、`ButtonNativeType`、Props、Slots 和 Emits 等公共类型，验证类型检查接受规格允许值并拒绝无效枚举值。
- [x] 2.3 使用 `<script setup lang="ts">` 实现 `SButton` 的默认值、视觉状态、默认与图标插槽、原生属性透传和单根原生按钮语义，并通过定向组件测试验证默认渲染与 Props 映射。
- [x] 2.4 实现 `disabled`、`loading`、可预测 click 事件和 `nativeType` 表单行为，验证快速测试覆盖事件次数、禁用/加载阻断和属性透传。
- [x] 2.5 添加 CSS Variables、公共令牌和 Button scoped 样式，覆盖 variant、size、block、disabled 与 loading，并通过库构建确认生成非空 `serenova-ui.css`。
- [x] 2.6 完成 `src/button/index.ts`、`src/components.ts` 和根插件入口，验证 `SButton` 具名导入、单组件安装和默认插件全量安装均能成功挂载。

## 3. 双轨 Storybook 组件工作台

- [x] 3.1 安装 Storybook Vue3/Vite、Docs 和 Themes 依赖，配置开发与静态构建脚本，并验证锁文件冻结安装成功。
- [x] 3.2 创建 `.storybook` 与独立 TypeScript 配置，在源码模式将包根入口和样式子路径 alias 到 `src`，并验证 Storybook 能完成类型检查和静态构建。
- [x] 3.3 在 Button 领域的 `stories/` 子目录编写 CSF Story 与专用样式，使用 `serenova-ui` 公共入口、Controls、Actions、自动文档和 `play` 交互，覆盖 variant、size、disabled、loading、block、插槽、点击和表单场景。
- [x] 3.4 配置全局主题、RTL 与常见视口工具栏，验证环境切换会重新呈现 Story 且新增 Story 可由 Storybook 自动发现，无需维护自建导航壳层。
- [x] 3.5 增加 Storybook 产物预览与静态构建模式，在启动前构建库并将相同公共导入解析到 `dist` JavaScript 与 CSS，验证解析守卫不允许预览读取组件实现源码。

## 4. 分层 UI 质量验证

- [x] 4.1 完善 Button 快速黑盒测试，覆盖 Props、Slots、Events、状态变化、class/style/data 属性透传，并验证测试不访问内部响应式状态且 `pnpm test:unit` 通过。
- [x] 4.2 编写 Chromium 真实浏览器组件测试，覆盖禁用/加载、表单 submit/reset、块级布局和必要计算样式，并验证 `pnpm test:browser` 通过。
- [x] 4.3 基于 Button 稳定 Story 状态矩阵建立视觉截图测试，固定字体、视口、时区和动画策略，并验证基线生成后重复运行无非预期差异。
- [x] 4.5 建立基于 `dist` 的 ESM、CommonJS、默认插件、具名组件、CSS 子路径和声明文件包级冒烟检查，验证破坏任一导出映射会使测试失败后再恢复正确映射。
- [x] 4.6 建立统一 CI 质量命令，串联 lint、格式检查、类型检查、快速测试、浏览器测试、Storybook 构建、视觉回归、构建和包级检查，并验证任一子命令失败时整体返回失败状态。

## 5. npm 发布配置与文档

- [x] 5.1 完善 `package.json` 的样式导出、files、sideEffects、License、repository、homepage、keywords 和发布前脚本，并通过构建后 `npm pack --dry-run` 验证只包含约定发布文件。
- [x] 5.2 添加与包元数据一致的 License 文件，并验证其出现在 dry-run 文件列表且 README 中的许可证说明一致。
- [x] 5.3 用中文完善 README，覆盖安装、全量与按需使用、样式导入、目录约定、Storybook 源码/产物预览、分层测试、构建和 npm 发布流程，将单个组件 API 说明集中到 Storybook Docs，并按文档示例完成一次 Storybook 静态构建验证。
- [x] 5.4 执行完整质量命令、正式库构建、包级冒烟、`npm pack --dry-run` 和 `npm publish --dry-run`，记录所有命令通过且再次确认 npm 包名可用。

### 发布前验证记录

- 2026-09-02：`pnpm quality`、`pnpm build`、`pnpm test:package`、`pnpm pack:check` 和 `pnpm publish:dry-run` 均通过。
- 2026-09-02：npm registry 查询 `serenova-ui` 返回 `E404 Not Found`，检查时该包名尚未注册。
- `npm pack --dry-run` 与发布 dry-run 均只列出 `dist`、`package.json`、`README.md` 和 `LICENSE`，共 12 个文件。

## 6. 移除无障碍测试与专用支持

- [x] 6.1 移除 axe、Storybook Accessibility、专用 Playwright 无障碍测试、运行脚本和相关文档配置，并验证依赖锁文件与测试发现范围不再包含该层。
- [x] 6.2 移除 Button、Story 和现有测试中的专用 ARIA、焦点、键盘与减弱动画支持，保留原生按钮、禁用和表单功能，并通过完整质量命令验证剩余能力。
