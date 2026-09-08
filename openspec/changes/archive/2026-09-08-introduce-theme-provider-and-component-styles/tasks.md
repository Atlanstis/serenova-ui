## 1. 公共契约与主题数据

- [x] 1.1 梳理 Provider 与 Button 的 Props/defaults、Slots、Events、渲染、交互、边界、类型和出口，记录四层测试适用性；以契约矩阵覆盖本变更全部规范场景验收
- [x] 1.2 建立共享 token、Button token、ThemePreset 与 ThemeOverrides 类型及明暗预设；以类型检查及默认值对照确认现有 Button 外观参数完整迁移
- [x] 1.3 实现不修改输入的主题合并和组件解析；以公开 Provider/组件测试验证继承、重置、覆盖优先级、undefined 与覆盖移除

## 2. 主题提供者与 Button

- [x] 2.1 实现无 DOM SThemeProvider、只读响应式上下文和公共导出；以共置 unit 测试验证默认插槽、无包装、默认 Props 和公共类型，确认无新增焦点或事件处理
- [x] 2.2 将 Button 接入默认主题解析及自身 CSS 变量绑定，保留 SFC 静态状态样式；以现有行为测试和元素级 style 覆盖测试验证兼容
- [x] 2.3 增加主题领域最小 integration Fixture；通过计算样式验证默认主题、明暗切换、组件覆盖、嵌套重置、兄弟隔离与状态保持
- [x] 2.4 增加 Provider + Teleport + Button Fixture；在真实浏览器验证传送前后及主题更新一致，复用既有 Button 鼠标/键盘与焦点测试验证无行为分叉
- [x] 2.5 验证 SSR 无 DOM 解析、连续渲染隔离及同输入 hydration；以输出主题值、浏览器初始外观和无 hydration 错误验收

## 3. 发布与按需样式

- [x] 3.1 在 Vite 8/Rolldown 建立最小多入口构建验证，确认 scoped 标识、CSS 拆分和共享依赖处理；以包含无关测试入口的消费产物证明规则可排除
- [x] 3.2 实现稳定组件 CSS 输出与同源全量聚合，移除全局主题初始化；以默认外观一致、无无关规则且无全局 reset 的产物检查验收
- [x] 3.3 增加组件、Provider 与明暗预设 ESM/CommonJS/类型子路径，保留根入口和 CSS sideEffects；以 Node 直接加载和 TypeScript 消费 Fixture 验证无 CSS loader 依赖
- [x] 3.4 更新源码出口测试及共享包消费 Fixture，扩展发布契约覆盖新路径、CSS 依赖、预设依赖图和 npm 文件边界；运行 package 测试确认 docs/测试资产不进入发布包

## 4. 消费与文档

- [x] 4.1 更新 Storybook 源码别名和主题切换配置；以 Storybook 类型检查和构建配置解析确认公共路径一致，不将 Storybook 作为自动化行为测试载体
- [x] 4.2 扩展最小 dist 消费应用的全量与按需主题切换流程；以 Chromium E2E 验证默认样式、暗色切换及按钮关键操作，仅使用公共入口
- [x] 4.3 更新 README 使用方式、全局 data-theme/祖先变量迁移和 docs 实现规范；通过文档示例与消费 Fixture 对照及格式检查验收
- [x] 4.4 整理稳定 token 到 Figma Variables/Code Syntax 的映射约定，明确组件局部变量作用域；以文档覆盖默认/暗色、共享/组件 token 和 Code Connect 接入边界验收，不写入 Figma

## 5. 整体验证

- [x] 5.1 运行 `pnpm type-check`（包含 `type-check:test`）、`pnpm test:unit`、`pnpm test:integration`，记录所有结果并确认 Provider 与 Button 的公共契约无回归
- [x] 5.2 运行 `pnpm test:e2e`、`pnpm test:package`、`pnpm format:check` 和 `pnpm lint`，记录四层验证与破坏性主题迁移说明，全部通过后完成验证记录，方案文档保持纯实现规范
