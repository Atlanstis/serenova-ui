## Context

当前 `package.json` 同时提供 Storybook 原始入口、`dev` 别名、dist 预览和两种静态站点构建。完整质量命令依赖 dist Storybook 间接生成 `dist`，随后再运行包级冒烟测试，使命令职责和前置条件不够直观。

Storybook 的实际边界已经确定为开发预览和预览集成测试；发布产物由 Vite、声明生成和包级冒烟测试负责。Playwright 当前通过一个即将删除的 Storybook 脚本启动测试服务器，相关配置需要随入口收敛一起迁移。

## Goals / Non-Goals

**Goals:**

- 为开发预览、快速检查、完整质量检查和发布验证分别保留明确入口
- 消除纯别名和不属于实际交付流程的 Storybook 模式
- 使每个可独立运行的测试命令自行满足必要前置条件
- 清理被移除功能留下的配置、生成目录和文档说明

**Non-Goals:**

- 不改变组件库公共 API、构建产物名称或 npm 导出映射
- 不改变 Story、Docs、Controls、主题、RTL、视口或 `play` 交互能力
- 不移除 Storybook 预览集成测试、浏览器组件测试或包级冒烟测试
- 不新增依赖、CI 平台或发布自动化

## Decisions

### 1. Storybook 只保留 `dev` 入口

`dev` 直接执行源码 Storybook，并作为维护者唯一需要记忆的预览命令。Playwright 的 `webServer` 同步调用 `pnpm dev`，确保人工预览和自动化预览测试走同一启动路径。

备选方案是保留 `storybook` 作为底层入口并由 `dev` 委托，但该别名没有提供参数封装或行为差异，只增加了一层跳转，因此不保留。

### 2. 删除 dist 预览和 Storybook 静态构建链

删除 `storybook:dist`、`dev:dist`、`build:storybook` 和 `build:storybook:dist`。`.storybook/main.ts` 固定将包公共名称映射到源码，移除环境变量分支、发布入口解析、dist 路径校验和源码回退守卫。

同时删除 `storybook-static/`、`storybook-static-dist/` 现有生成目录，并从 `.gitignore`、`.prettierignore` 和 ESLint 忽略配置移除对应规则。这些目录是可再生成且未纳入版本控制的构建结果，不提供迁移或备份。

备选方案是保留静态构建用于配置健全性检查，但预览集成测试已经通过真实 Storybook 服务验证开发环境；静态部署不属于项目目标，额外构建不能覆盖发布包契约。

### 3. 用包级冒烟测试闭合发布产物验证

`test:package` 先执行 `build`，再运行包消费冒烟脚本，使单独调用不会读取陈旧或缺失的 `dist`。该测试继续验证 ESM、CommonJS、CSS、类型声明、Vue external、插件安装、具名导出和 npm 文件边界。

备选方案是在 `quality` 中显式执行 `build && test:package`，但这会让 `test:package` 作为独立入口仍带有隐含前置条件。

### 4. 保留两级聚合检查并通过委托去重

`check` 按低成本优先顺序运行格式检查、Lint、完整类型检查和默认快速测试。`quality` 先调用 `check`，再运行浏览器组件测试、Storybook 预览集成和自带构建的包级冒烟测试。

不将两者合并为单一命令，因为本地快速反馈和发布前完整验证具有不同时间成本。`test` 继续委托 `test:unit`，保留 npm 生态通用入口；`test:e2e` 因与实际的预览集成语义不符且仓库内不存在调用方而删除。

### 5. scripts 按维护者使用优先级排列

脚本依次按开发、构建、聚合检查、格式与 Lint、类型检查、测试、发布检查和生命周期钩子分组。排列仅改善 `package.json` 可读性，不影响 npm 或 pnpm 执行语义。

## Risks / Trade-offs

- [外部个人脚本仍调用被删除的别名] → 在变更说明和 README 中列出规范替代入口：`storybook` 使用 `dev`，`test:e2e` 使用 `test:preview`；dist 与静态构建入口不提供替代项
- [`quality` 因 `test:package` 自带构建而耗时] → 接受一次必要构建以保证包测试不依赖陈旧产物，并移除原有两个 Storybook 静态构建抵消额外成本
- [删除静态目录后需要恢复内容] → 这些目录是可再生成的忽略产物；如需临时排查，可直接调用 Storybook CLI 构建，但不恢复项目脚本
- [简化 Storybook 配置时影响源码别名] → 保留 `serenova-ui` 与 `serenova-ui/style.css` 到源码入口的精确映射，并通过 `test:preview` 验证 Story 发现和运行

## Migration Plan

1. 收敛 `package.json` scripts，并更新 Playwright 的 Storybook 服务启动入口。
2. 简化 Storybook 配置，删除 dist 模式实现。
3. 删除两个 Storybook 静态输出目录及对应忽略规则。
4. 更新 README 和测试文档中的命令与职责说明。
5. 依次运行格式检查、Lint、类型检查、unit、browser、preview、build、package、聚合质量及发布 dry-run 验证。

若验证失败，可恢复原脚本和 Storybook 模式配置；两个静态目录无需回滚，因为它们属于可再生成产物。
