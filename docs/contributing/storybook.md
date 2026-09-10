# Storybook 示例开发

运行 `pnpm dev`，访问 [Button Docs](http://localhost:6006/?path=/docs/components-button--docs)。当前只提供 Button 分类，图标和主题提供者作为 Button 的组合依赖使用。

## 文件组织

参数调试仅在 Docs 顶部展示并提供 Controls，复用 Playground.vue；下方示例列表和侧边栏保留八个独立用法。

每个组件在自己的 `stories/` 目录维护一个 `组件名.stories.ts` 文件，示例平铺在 `stories/examples/` 下。Button 包含以下示例：

根 `tsconfig.json` 通过项目引用统一关联库、Storybook 和测试配置。`tsconfig.storybook.json` 加载 `vite/client` 的 `?raw` 声明与公共入口别名，覆盖所有组件 Stories；新增组件无需创建目录级 tsconfig。共享编译选项位于 `tsconfig.base.json`，库源码检查使用 `tsconfig.lib.json`，声明生成使用 `tsconfig.build.json`。

| 文件                   | 主题              |
| ---------------------- | ----------------- |
| Appearance.vue         | 类型与外观        |
| Sizes.vue              | 尺寸              |
| DisabledAndLoading.vue | 禁用与加载        |
| Icons.vue              | 图标插槽          |
| IconOnly.vue           | 纯图标按钮        |
| Text.vue               | 文字按钮          |
| Interaction.vue        | 点击与键盘交互    |
| ThemeOverride.vue      | 局部主题覆盖      |
| Playground.vue         | Docs 顶部参数调试 |

## 新增或修改示例

1. 在 `examples/` 创建一个 Vue 单文件组件，从 `serenova-ui` 公共入口导入所需组件。使用 `<script setup lang="ts">`，把必要状态、事件处理和局部样式放在该文件内；少量布局样式允许重复，以保持完整可复制。
2. 在 Story 文件中普通导入该 SFC 用于渲染，再通过相同路径的 `?raw` 导入文件原文。
3. 设置该 Story 的 `parameters.docs.source`，其中 `code` 使用原文导入，`type` 为 `code`，`language` 为 `html`。同时添加中文名称与用途说明。
4. 固定展示关闭 Controls。需要调试的示例通过有默认值的 props 接收输入、通过 emits 转发事件；Storybook 的 fn、play、Actions 接入留在 Story 文件中。
5. 执行 `pnpm type-check:storybook`。整个 `src/**/stories/**` 属于开发工作台，组件库类型检查与声明构建排除该目录。

Show code 展示运行示例对应的完整文件，包括脚本、模板、注释和样式。Controls 改变预览输入，代码区始终保留文件原文与默认值。示例不依赖 `--preview-*` 变量、外部示例布局文件或 Storybook 包。

## 人工验收清单

以下是页面验收步骤，不代表已完成浏览器验证：

- 启动 dev，确认侧边栏仅有 Button，Docs 地址正常，顶部为参数调试与 Controls，下方八个用法按表中顺序展示；侧边栏无参数调试和基础用法入口。
- 逐一展开 Show code，与对应 Vue 文件核对全文；确认示例包含必要样式，复制到正常安装组件库的 Vue 客户端项目可使用。
- 在参数调试中切换每个公共属性、文案和图标选项，确认可恢复 none；纯图标始终有图标，不适用控制项隐藏。
- 调整交互示例的 text、ghost、尺寸及类型，观察预览改变、源码仍为原文；鼠标点击与聚焦后 Enter/Space 每次计数一次，Actions 接收到事件。
- 切换 disabled/loading，确认按钮不可用且计数不变；重复执行 play，检查基于当前计数的增量。play 的禁用分支仅检查状态，不替代独立公共契约测试。
- 点击禁用与加载示例中的保存按钮，观察加载、1.2 秒后恢复及成功文案，再次操作仍有效。
- 查看文字按钮的四种语义颜色、禁用、加载、Text + Ghost、操作间距，以及悬停下划线、Tab 焦点和无点击波纹。
- 对照图标加载前后的变化、纯图标状态和局部主色覆盖，切换 RTL 与视口检查排列。
- 临时修改某个示例模板、脚本或 scoped 样式，确认预览与 Show code 都热更新；验收后恢复临时修改。

公共行为由独立组件测试承担，Storybook 仅用于开发预览与交互调试。
