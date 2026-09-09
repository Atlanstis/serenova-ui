## Context

动机见 proposal.md。本次跨越公共 Props、主题覆盖类型和 Storybook，并包含公开字段迁移，因此需要技术设计。

探索阶段已通过 Figma MCP 读取 [样式与状态](https://www.figma.com/design/RXjt6R6Hhaz4NJP8fYw533/serenova-ui?node-id=7-2)、[加载反馈](https://www.figma.com/design/RXjt6R6Hhaz4NJP8fYw533/serenova-ui?node-id=13-238) 和 [图标用法](https://www.figma.com/design/RXjt6R6Hhaz4NJP8fYw533/serenova-ui?node-id=75-307)。设计明确支持 Ghost、前后图标、正方形按钮、600 ms／5 px 波纹和约 800 ms 加载旋转，未发现 block 要求。

当前 SButton 使用原生 button 和统一 click 处理；useButtonTheme 按变体派生主题值，Text 会排除 Ghost。现有 Story 共七个，Form 和块级示例承担了本次要移除的展示内容。评估仅基于设计与源码，尚未执行页面验证。

## Goals / Non-Goals

目标：通过删除额外分支收敛组件，保持剩余公共契约可验证；让展示矩阵与交互示例各有清晰用途。

边界：不新增公共组件、状态模拟 Props、依赖或 Storybook 自动化测试体系。Pressed 偏移与投影差异不在本次实现范围。共享主题与 disabledOpacity 不做扩展清理。

## Decisions

### 1. 直接移除 block，并保留标准属性透传

删除 public-types 中的 block、默认值、isBlock、class 绑定与专用 CSS，保留图标按钮的尺寸规则。相比保留废弃别名，直接移除能消除旧组合契约；相比新增布局组件，消费端通过现有 class/style 即可完成满宽布局。

不新增运行时未知属性过滤器。旧 JavaScript 消费代码继续传 block 时，Vue 可能将其作为普通属性透传，但它不再具有布局语义；不承诺运行时抛错。类型测试验证 ButtonProps 不包含该键。

### 2. 定点删除无效主题字段

删除 ButtonThemeTokens 和 buttonThemeKeys 中的 ghostColorText，并调整默认字段生成，避免仍将其写入动态生成的对象。保留基础 ghostColor 和四种语义后缀字段，以及 Primary 基础覆盖优先级。无需重构整个主题解析器。

相比全面压缩主题字段，这一方案只移除已证明无效的入口。迁移时直接删除 ghostColorText；若原意是调整文字按钮正常颜色，应使用 textColorText，这属于明确设置有效覆盖，不能自动转换原本无效的值。

### 3. 将展示整理为六个独立主题

| 展示主题   | 内容与参数策略                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 基础用法   | 保留 Playground 入口，支持有效公共 Props；增加仅供 Story 使用的文案、图标配置，显式分离后再向按钮传参；iconOnly 自动提供可见图标 |
| 类型与外观 | 五种类型和四种 Ghost，固定比较维度；Text Ghost 显示不适用；用中文标签解释类型                                                    |
| 尺寸       | 三档按钮使用相同文案，标注高度，避免文字宽度干扰比较                                                                             |
| 禁用与加载 | 五种普通按钮禁用与加载、四种 Ghost 加载，以 Medium 为主，避免所有维度笛卡尔积                                                    |
| 图标用法   | 前置、后置、双图标、纯图标与 Ghost 纯图标；补充纯图标尺寸及状态代表例                                                            |
| 交互反馈   | 可见计数、Actions、真实键盘焦点与波纹；浅色局部覆盖沿用现有 Provider 能力，放在该主题内的小型对照区域，无须增加第七个 Story      |

删除 Form 导出、表单状态和处理函数及 button-story__form 专用 CSS。原生表单能力继续在 API 文档与独立测试中表达。清理不再使用的组件注册、说明和辅助选择器。

固定矩阵仅暴露真正绑定的 Controls，Playground 承担自由组合；保留原有 Playground 和 Interaction 标识，其余导出按主题命名。Hover、Pressed 和 Focus 使用真实交互，不通过公共 Props 或复制组件样式伪造。

### 4. 调试交互采用本次操作的增量结果

鼠标、Enter、Space 均使用 SButton 原生路径，Story 的计数处理和 Actions 复用同一事件回调。play 先读取本次计数及事件调用基线，可用时执行激活并验证增量；不可用时验证 disabled 与计数不变，不对禁用按钮执行可能等待超时的用户点击。重复播放不得依赖累计调用次数恒为一。

相比移除 play，保留它便于调试；相比固定所有参数，允许状态调节能观察禁用和加载的真实行为。公共行为正确性仍由组件测试承担。

## Risks / Trade-offs

- [公开类型删除导致消费端编译失败] → 提供 block 到 class/style 的迁移说明，同步根入口和单组件入口的消费类型 Fixture
- [动态主题生成残留无效字段] → 同步登记与生成路径，验证剩余文字和 Ghost 覆盖的可观察输出
- [移除 Form 被误解为移除表单能力] → 保留 nativeType 类型、submit/reset 集成测试和现有消费应用表单 E2E
- [矩阵密度过高] → 以 Medium 为主，尺寸单列，图标状态采用代表例；窄视口保留标签对应关系并允许展示区域横向滚动
- [旧 Story 链接失效] → 保留可复用入口标识，文档列出删除或合并的展示项，不创建过渡空 Story

## Migration Plan

1. 同步删除公共字段、实现分支、旧测试输入和展示引用，补充消费迁移说明；不修改已归档的历史变更。
2. 普通满宽按钮从 block 改为消费端 class/style；移除 ghostColorText 配置，无需替换无效旧值。
3. 运行下表质量检查，更新现有契约与验证说明并记录实际结果。发布说明标注破坏性字段删除。
4. 若回退，整体恢复此次组件、类型、Stories 和测试变更，避免只恢复旧类型却缺失其运行时行为。

| 验证层      | 适用性与范围                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| unit        | 适用：Props、Slots、事件、空槽、动态状态、源码类型、根及单组件公共出口；移除 block 用例，验证剩余输入和字段边界                |
| integration | 适用：默认尺寸、纯图标、鼠标键盘一致性、焦点、表单和有效主题覆盖；删除内置 block 场景，保留标准宽度样式透传的消费验证          |
| E2E         | 适用现有回归：公共类型与主题路径涉及 dist 消费；运行现有全量/按需安装、加载提交和局部覆盖流程，无需新增 Storybook 或每组件 E2E |
| package     | 适用：公开 Props 与主题类型删除，需要验证共享消费 Fixture、声明、ESM/CJS、CSS、插件、导出映射与文件边界                        |

执行 pnpm type-check、pnpm test:unit、pnpm test:integration、pnpm test:e2e、pnpm test:package；其中 type-check 包含测试与 Storybook 类型检查。实现阶段按仓库要求加载 Vue 测试技能。浏览器集成测试属于质量命令；手动打开 Storybook 页面验证需用户明确要求。
