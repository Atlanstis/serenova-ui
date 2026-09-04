## 1. 收敛命令入口

- [x] 1.1 按开发、构建、聚合检查、格式与 Lint、类型检查、测试、发布和生命周期钩子的优先级重排 `package.json` scripts，删除 `storybook`、`storybook:dist`、`dev:dist`、`build:storybook`、`build:storybook:dist` 与 `test:e2e`，并通过读取脚本清单确认仅保留约定入口
- [x] 1.2 让 `dev` 直接启动源码 Storybook，令 `check` 复用默认 `test`、`quality` 复用 `check`，并令 `test:package` 在冒烟检查前执行 `build`；分别运行 `pnpm check` 与 `pnpm test:package` 验证组合关系和独立前置条件
- [x] 1.3 将 Playwright 的 Storybook 服务启动命令切换为 `pnpm dev`，运行 `pnpm test:preview` 确认预览集成仍能自动启动服务并通过

## 2. 简化 Storybook 配置与输出

- [x] 2.1 删除 `.storybook/main.ts` 中的 dist 模式、包产物解析和源码回退守卫，只保留公共包名到源码及源码样式的别名，运行 `pnpm type-check:storybook` 验证配置与 Story 类型
- [x] 2.2 删除现有 `storybook-static/` 与 `storybook-static-dist/` 目录，并从 `.gitignore`、`.prettierignore` 和 ESLint 配置移除对应规则；检查文件树和配置引用，确认目录不存在且仓库不再引用静态输出名称

## 3. 更新命令文档

- [x] 3.1 更新根 README，按使用优先级说明所有保留命令的作用、组合关系和适用时机，移除 dist 预览、Storybook 静态构建与 `test:e2e` 说明，并人工核对 README 中的每个命令都存在于 `package.json`
- [x] 3.2 更新测试工作区 README，明确 Storybook 仅用于开发预览和 `test:preview` 集成测试，并通过全文检索确认活动代码与文档不再引用被删除命令

## 4. 完整验证

- [x] 4.1 运行 `pnpm format:check`、`pnpm lint` 和 `pnpm type-check`，确认格式、代码检查及源码、Storybook、测试类型检查全部通过
- [x] 4.2 运行 `pnpm test:unit`、`pnpm test:browser` 和 `pnpm test:preview`，确认快速组件测试、真实浏览器行为与开发预览集成全部通过
- [x] 4.3 运行 `pnpm build`、`pnpm test:package`、`pnpm quality`、`pnpm pack:check` 和 `pnpm publish:dry-run`，确认构建、包消费、完整质量门槛和发布演练均通过，并记录各验证结果
