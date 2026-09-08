## Context

动机见 proposal.md。当前 Vue 3 SFC 已有局部 scoped CSS，Vite 8/Rolldown 通过单库入口提取全量 CSS，包同时支持 Node ESM 与 CommonJS。现有 token 在 `src/styles/index.css` 的全局选择器中，Button 消费这些变量。新方案同时影响主题上下文、组件渲染和包构建，必须形成设计文档。

## Goals / Non-Goals

**目标：** 将主题数据传递、组件变量解析、结构 CSS 发布分开；保证默认消费与局部主题一致；保留静态 CSS、Node 直接加载与独立组件消费能力。

**非目标：** 不引入运行时样式挂载、Tailwind、Sass、hash 缓存、自动 resolver、业务 DOM 主题容器、实际浮层组件、系统主题自动检测或 Figma 双向同步。不承诺 CSS 变量对宿主样式完全隔离。

## Decisions

### 1. 无 DOM 的 SThemeProvider

Provider 用 `<script setup lang="ts">` 与类型化 provide/inject 传递只读响应式配置，默认插槽直接输出；不透传 attrs 到任意插槽子项，不提供 tag、DOM ref 或业务事件。不注册鼠标、键盘和焦点处理。相比容器变量继承，这避免布局包装并使 Teleport 沿用普通组件主题路径；代价是每个组件计算和绑定所需变量。

### 2. 主题模型与合并

公共类型规划为 `ThemePreset`、`ThemeTokens`、`ThemeOverrides`、`ButtonThemeTokens`、`ThemeProviderProps`。`ThemeOverrides` 采用 `{ common?: Partial<ThemeTokens>, components?: { Button?: Partial<ButtonThemeTokens> } }`，Provider 的 `tokens` 使用该类型。预设包含完整共享 token 及可选组件覆盖，不引用组件实现。

`preset` 未指定、`tokens` 未指定、`inherit=true` 为默认输入。显式 preset 优先作为基础；否则 inherit 为真时采用父上下文；否则采用默认浅色主题。随后按已知字段合并当前 tokens，忽略 undefined；未声明字段不传播，null 不作为重置协议。每次从输入重新计算，移除覆盖可以恢复基础值，不修改预设或调用方对象。

合并后的共享 token 先输入组件默认解析函数，再应用基础主题与当前组件覆盖。显式预设和 inherit=false 都截断父共享及组件覆盖。主色 hover、前景色等作为独立语义 token，不承诺修改一个主色自动生成整套色阶。

Naive UI 将 theme 和 themeOverrides 分别继承，并用 null 分别截断。本方案借鉴分层，使用单一 inherit 重置语义，避免父覆盖意外残留。

### 3. 默认主题和组件变量

默认 token 与明暗预设统一维护为类型化、可序列化数据；Button 的尺寸、颜色、圆角、动画等主题默认值迁入该体系。无 Provider 时，组件同样解析默认主题并绑定变量，不再以全局 tokens.css 或构建生成的重复 fallback 作为主要兜底。

组件仅输出自己需要的变量，并使用稳定、带组件领域的名称，例如 `--s-button-background`、`--s-button-text-color`。结构与状态选择器继续留在 SFC scoped CSS。模板不散落主题合并判断；动态变体仍复用既有业务路径。公开文档只承诺明确列出的主题 token，内部临时变量不自动成为覆盖 API。

组件根元素的变量绑定与用户 class/style 合并必须保持现有属性透传能力，显式元素级 style 覆盖同名变量具有最终优先级。祖先全局变量不作为新主题选择协议；这与旧 token CSS 的迁移边界一致。color-scheme 如需设置，仅设置到组件作用范围，不修改 documentElement。

### 4. 静态样式按组件发布

保留包根组件及插件入口，新增 button、theme-provider、themes/light、themes/dark 子路径和 button/style.css。所有 JS 产物不包含 CSS import/require；CSS 由消费方显式导入，后续 resolver 另行设计。无 DOM 的 Provider 无独立 CSS。

采用 Vite 多入口并启用 CSS 拆分，建立入口到输出 CSS 的确定映射。若提取产生共享 CSS，发布步骤必须让公开组件 CSS 自包含或保留可解析的必要依赖；不依赖构建时偶然生成的 hash 文件名作为公共路径。全量 CSS 从同一批规则聚合，不手工复制源码样式。保留 CSS sideEffects，避免误删。

实施先用当前版本构建原型验证 CSS 提取、共享依赖与 scoped 标识的一致性，再确定最小产物整理方式；不能仅打开 cssCodeSplit 后声称完成。无关组件排除通过测试专用第二入口验证，不为测试新增公共组件。按组件保留所有 variant 和状态，不进行页面级选择器裁剪。

### 5. Teleport 与 SSR

组件通过逻辑上下文取得主题并将变量写到自身渲染节点；Teleport 不需要从父 DOM 复制样式。用 Provider + Teleport + Button 的最小 Fixture 验证跨位置及响应式变化。独立应用或未来命令式 API 不自动继承，应显式连接配置；本轮不新增该 API。

主题状态不使用可变全局单例，不读取 window/document 推导初值；SSR 将变量随组件 HTML 输出。使用不同主题连续服务端渲染及相同输入 hydration 验证隔离和首屏一致性。服务端仍需由消费应用加载静态 CSS。

### 6. Figma 与方案文档

`docs/styling-and-theming.md` 作为可独立阅读的架构说明，标记尚未实施的接口。维护公共语义 token、组件 token 与 CSS 名称映射，后续用于 Figma Variables、Modes、Code Syntax 和 Code Connect。数据来源于同一份审核后的主题模型，不创建另一份手工维护色表；复合 token 单独定义转换，暂不实现导出器。

## Risks / Trade-offs

- 每个组件有响应式计算及行内变量 → 仅计算该组件需要的变量，先测量真实成本，暂不引入 hash 缓存。
- 无 DOM Provider 不会给业务 div 注入变量 → 文档明确作用对象，未来独立评估业务主题容器。
- 全局 data-theme 与自定义变量消费发生迁移 → 明确标注破坏性变更，提供暗色预设与覆盖示例，发布时同步迁移说明。
- CSS 分包可能漏共享规则或重复 → 用最小消费构建和发布契约验证依赖闭包及全量/按需结果。
- 预设可能间接引入所有组件 → 预设仅引用 token 数据，检查消费依赖图。
- 任意错误字符串不能靠 CSS fallback 修复 → 公共类型约束已知键和基础值类型；调用方仍需提供合法 CSS 值，不新增运行时 CSS 校验器。

## Migration Plan

1. 先建立 token 数据与解析，再实现无 DOM Provider；迁移 Button，保留 Props、事件与默认外观。
2. 建立组件/预设子路径及分包，更新源代码出口、共享消费 Fixture 和 Storybook 别名。
3. 更新旧暗色切换：将 data-theme 属性改为 Provider 的 preset；将祖先变量覆盖改为 tokens。删除全量 CSS 的全局主题初始化。
4. 同步 README 与 docs 状态，验证各测试层和格式。发布标记主题接入的破坏性变更。
5. 若质量验证失败则不发布；已发布后的回退使用上一包版本，并将消费方主题接入与版本一起回退。

## 验证策略

| 层级        | 适用性与范围                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------- |
| unit        | Provider Props 默认值、插槽、无包装语义、主题输入与公共类型/出口；Button 既有契约回归；SSR 隔离 |
| integration | 真实计算样式、继承与重置、覆盖移除、同页多主题、Teleport、hydration、Button 鼠标/键盘与焦点行为 |
| E2E         | 使用 dist 的全量与按需消费、主题切换和按钮关键流程，不按组件机械增加文件                        |
| package     | Node ESM/CommonJS、全部新子路径和类型、CSS 依赖与副作用、无关规则排除、npm 文件边界             |

必须运行 `pnpm type-check:test`、`pnpm test:unit`、`pnpm test:integration`、`pnpm test:e2e`、`pnpm test:package`，并记录结果。浏览器测试属于后续实施验收，本次规划不启动浏览器。
