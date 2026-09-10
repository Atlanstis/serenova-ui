# Git 提交信息规范

- 提交信息必须遵循 Conventional Commits，标题格式为 `<type>(<scope>): <subject>`；`scope` 可省略。
- `type` 仅可使用 `build`、`chore`、`ci`、`docs`、`feat`、`fix`、`perf`、`refactor`、`revert`、`style`、`test`。
- `scope` 应使用英文小写的组件名或模块名。
- `subject` 应使用中文简洁描述主要变更，不以句号结尾，禁止使用 `update`、`fix bug`、`修改代码` 等含义不明确的描述。
- 提交正文可省略；需要补充变更点时，标题后必须空一行，且每条非空信息必须以 `- ` 开头。
- 每个正文列表项只描述一个变更点，使用中文且不以句号结尾。
- 破坏性变更必须在 `type` 或 `scope` 后添加 `!`，并在正文后以 `BREAKING CHANGE:` 说明迁移影响。
- 一次提交只包含一个逻辑变更。

示例：

```text
feat(button): 增加按钮加载状态

- 支持 loading 属性
- 加载时阻止重复点击
```

破坏性变更示例：

```text
feat(theme)!: 调整主题配置结构

- 使用令牌对象替代扁平配置
- 移除旧版颜色字段

BREAKING CHANGE: 旧版主题配置需要迁移至新的令牌结构。
```
