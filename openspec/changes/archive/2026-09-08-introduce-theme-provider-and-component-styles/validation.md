# 实施验证记录

## 完成范围

- 实现无 DOM 的 SThemeProvider、类型化共享/组件 token、默认浅色和暗色预设。
- Button 在自身节点绑定变量，支持共享覆盖、组件覆盖、元素 style 覆盖及无 Provider 默认主题。
- 实现多入口 ESM/CommonJS/声明与按组件静态 CSS；公共样式入口通过 CSS import 引用提取的依赖资产，全量入口聚合同一批资产。
- 更新 Storybook 主题配置与 Provider 示例、README、公共类型消费 Fixture、分层测试和方案规范。
- `docs/styling-and-theming.md` 保持方案唯一真实来源和纯实现规范，不添加实施过程或工作流状态。

## 分层选择

| 层级        | 是否适用 | 理由与结果                                                                                 |
| ----------- | -------- | ------------------------------------------------------------------------------------------ |
| unit        | 是       | Provider 默认输入、插槽、无包装、主题覆盖、类型/出口与 SSR；5 个文件、26 个测试通过        |
| integration | 是       | 计算样式、主题嵌套/重置、状态保持、Teleport、hydration、键盘与焦点；2 个文件、7 个测试通过 |
| E2E         | 是       | 从 dist 全量/按需入口消费及主题切换、表单与加载状态；Chromium 3 个流程通过                 |
| package     | 是       | 新子路径、Node 模块、声明、CSS 依赖、独立预设依赖图、npm 边界；全部通过                    |

## 已执行命令

- `pnpm type-check`：通过，包含组件库、Storybook 与测试类型检查
- `pnpm type-check:test`：通过
- `pnpm test:unit`：26/26 通过
- `pnpm test:integration`：7/7 通过
- `pnpm test:e2e`：3/3 通过，包含重新构建
- `pnpm test:package`：通过，包含重新构建
- `pnpm lint`：通过，无警告
- `pnpm format:check`：通过
- `git diff --check`：通过

浏览器仅用于既定的自动化 integration/E2E 验收，没有进行人工页面效果验证。Storybook 通过类型检查验证接入，不作为行为验收载体。

## 关键证据

- 无关样式排除使用两个测试入口和共享 CSS：先构建测试库，再构建只消费 selected JS/CSS 的应用；产物包含 Button 和共享规则，不含 unrelated 规则。
- 单组件与全量 CSS 展开后的规则一致；无全局 :root、data-theme 或 Story 样式。
- 预设单独消费的构建不产生 CSS 资产，也不包含组件渲染逻辑。
- Node ESM 与 CommonJS 均直接加载根、Button、Provider 和预设子路径；安装后的包消费 Fixture 完成类型检查。
- 主题重置清除父组件覆盖；内层共享值重新派生；移除覆盖恢复基础值；兄弟主题不受影响。
- Teleport 中的 Button 与原主题一致；相同输入 hydration 复用节点且没有警告，SSR 请求不共享可变主题状态。

## 兼容性与限制

全局 data-theme 暗色切换及祖先主题变量改用 Provider 的 preset/tokens；README 已提供迁移方式。没有新增运行时 CSS 引擎、自动 resolver 或 Figma 同步。CSS 仍需显式导入，普通业务 DOM 的样式由应用管理。

每个组件实例会解析并输出所需变量；未宣称整体 JS/CSS 体积下降比例。构建中的稳定样式入口是依赖入口，实际规则位于同包内部 CSS 资产，不能仅用入口文件字节数估算样式体积。
