## Context

动机与变更范围见 proposal.md。当前 Vue 3 组件使用 `<script setup lang="ts">`、组件内 CSS、Provider 注入和组件级主题解析。包采用 Vite 多入口输出 ESM/CommonJS，再生成类型声明；公共组件通过 withInstall 支持独立安装。现有 Button 仅有前图标槽，加载指示器由 CSS 边框绘制。

本变更跨越主题、公共组件和发布边界，需要技术设计。2026-09-08 已通过 Figma MCP 读取文件 `RXjt6R6Hhaz4NJP8fYw533`：Button 页面 `3:60`，状态面板 `7:2`，图标用法 `75:307`，Icon 页面 `12:103`。Button 变量集合只有浅色模式；`color/dark` 是颜色值，不是暗色模式。字体集合另有中文和 English 两个模式。

## Goals / Non-Goals

**目标：** 在现有组件与主题结构上实现规格；图标资产可追溯、生成结果可复现，外部消费无需 loader；公开入口精简且支持 ESM tree shaking。

**非目标：** 不引入运行时图标注册中心、外部图标库、字体下载服务或新的测试体系；不实现暗色设计，也不禁止消费端自行定义颜色。字体由消费端提供，库仅声明字体栈，不主动请求远程字体。

## Decisions

### 1. Button 保留单一组件与正交属性

继续使用 variant、size 和原生按钮，不拆出 LoadingButton、GhostButton、IconButton。ghost 表示外观，loading/disabled 表示交互状态，iconOnly 表示布局；不将 Figma 的 WaveStart 等原型阶段暴露成 Props。相比完整复制 Figma 变体矩阵，这样可避免状态组合膨胀并复用一条业务激活路径。

默认 primary，删除 default/danger，error 替代旧错误语义。text+ghost 按 text 渲染；iconOnly 优先于 block，只显示前置槽。普通无内容按钮允许为空；iconOnly 无图标时保持空的正方形，loading 时仍显示加载图标，不生成虚构占位资源。这些组合为确定性边界规则。

保留 icon 并新增 suffixIcon。loading 隐藏两个业务图标槽，只显示一个 Loading 与原默认文案；退出恢复槽内容。普通按钮按内容布局，不新增“加载前后宽度锁定”契约；纯图标始终固定正方形。

### 2. 真实 SVG 在开发阶段转换为具名 Vue 组件

规划目录如下；仅在实施阶段创建：

```text
assets/icons/                 清理后的 SVG 与来源清单
scripts/generate-icons.mjs     确定性转换与检查
src/components/icon/
  src/generated/              六个生成的 Vue SFC
  src/public-types.ts         IconProps
  index.ts                    具名导出与 withInstall
tests/components/icon/        unit、最小 integration Fixture
```

来源清单记录 fileKey、nodeId、组件名、获取日期及原始内容校验值：Add `72:10`、Delete `72:12`、Edit `72:14`、Search `72:16`、ArrowRight `20:4`、Loading 单一静态组件 `20:2`。Loading 仅使用一份真实图形，旋转由按钮 CSS 驱动。

按用户补充要求，assets 也存放去除固定颜色及画布背景后的 SVG；来源清单分别记录导出内容与清理后资源的校验值。转换器只规范化颜色、根尺寸和无用导出元数据，不生成或改写路径几何。已检查 Add 是 24×24 viewBox、2 px 圆端描边、固定 `#6D28D9`，因此将单色 stroke/fill 转为 currentColor，保留 none、透明度和几何属性。生成时检查元素、属性和引用；当前六个简单图标如出现未知节点、脚本、外链、渐变或裁剪引用则明确报错，禁止静默丢失内容。未来扩展带引用资源另行设计，不在本次假装支持。

使用开发依赖 @xmldom/xmldom 严格解析 XML/SVG，解析警告与错误均终止转换，不使用正则盲改 SVG 结构。生成 SFC 使用 Composition API 与共享 IconProps，模板为静态 svg/path 等节点，不使用 v-html。清理后的资源和生成文件提交仓库，提供检查模式验证重复生成无差异；常规消费和发布构建不联网访问 Figma。

每个组件根 svg 设置 viewBox，size 默认 24，数字转换 px，CSS 长度字符串直接使用；color 缺省 currentColor，class/style/原生属性通过根节点透传。Button 使用图标槽容器的局部样式将默认 SVG 宽高约束到 16 px，图标自身没有全局规则。显式消费端 style 可按普通 CSS 优先级覆盖。

相比 img，这能继承按钮前景色；相比 mask，保留真实 SVG DOM 和属性；相比运行时 name 注册表，静态具名导出便于类型提示和消除未使用代码。用户已明确要求内联 SVG 与独立组件导出。

### 3. 仅保留包根与 icons 集合入口

六个组件与 IconProps 从 `serenova-ui`、`serenova-ui/icons` 导出。package.json 仅新增 `./icons` 精确映射，不设置 `./icons/*`，不提供 icons/add 等单图标路径。Vite 新增集合入口并生成对应声明，沿用 Vue external；图标不增加 CSS 入口，也不加入要求 CSS 存在的 componentStyles 列表。

默认插件注册全部六个图标，图标支持单组件 app.use。各生成组件和安装包装需保持可 tree shake；Button 只从图标内部精确模块引用 Loading，不经聚合注册表引入全部图标。验证从集合入口仅导入 Add 的 ESM 构建不包含其他图标或 Button；包根具名导入也检查相同消除能力。CommonJS 保证导出可用，不承诺 tree shaking。

外部用法为 `import { SIconAdd } from 'serenova-ui/icons'`，或从包根导入，均可不加载 CSS 独立渲染。

### 4. 浅色 token 与状态规则明确分层

保留共享 common → Button 默认派生 → Button 覆盖的解析顺序。将 colorDanger、colorDangerHover、colorOnDanger 及 Button 的 Danger 后缀字段迁移为 Error，对新增 Pressed、Disabled、Focus、Ghost、尺寸和波纹参数建立命名明确的组件 token，同步白名单与公共类型。普通 background 等字段应明确承载默认 primary 基础值，避免继续代表已移除的中性 default。

规格给出固定验收数值；实施时再核对来源节点及完整状态参数，不将 MCP 参考 React/Tailwind 代码直接粘贴。Figma 普通按钮三档均为 14 px/500/20 px，字体优先 Noto Sans SC 并回退 sans-serif；英文可继承消费端字体，不新建语言模式 API。Primary 默认阴影采用已读取的 0 2px 3px、rgba(64,38,102,.08)。颜色和尺寸由 lightPreset 及组件 token 驱动，不通过全局 :root 初始化。

### 5. 原生激活和局部动画

isDisabled 由 disabled 或 loading 派生；显式派生 text、ghost、iconOnly 等有效状态，模板不散落重复判断。原生 button 处理 Enter/Space，不额外模拟键盘 click。有效 handleClick 同时发出一次 click 并启动可用语义按钮的波纹；禁用拦截仅用于防御程序触发，保留明确条件和原因。

焦点用 focus-visible 表达，不清除原生焦点而不提供替代反馈。外环用绝对定位的装饰层或伪元素，指针穿透，不占布局空间；不要让按钮整体 overflow:hidden 裁掉外环。600 ms 扩散 5 px 后清理；连续激活重启当前动画，状态切换与卸载清理动画资源。Loading 使用真实 SVG、800 ms 线性旋转，无须为每帧生成组件。文本按钮不产生波纹。保留 nativeType、attrs 和原生表单行为。

### 6. 移除内置 dark，保留 Provider 能力

删除 dark 源文件、Vite 入口、package.json 映射、Storybook 别名和工具栏选项、README 与主题文档中的内置暗色说明。Provider 的 preset/tokens/inherit 及继承、Teleport、SSR/hydration 能力保留；现有暗色测试改用自定义浅色覆盖，不能直接删掉其验证的隔离或响应式契约。旧归档变更作为历史不批量改写，本次以 delta 更新现行规范。

### 7. 验证范围

| 层级        | 适用原因与主要断言                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| unit        | Button 全部公共 Props/默认值、Slots、click、动态组合与旧类型移除；六个图标的 SVG 语义、size/color/attrs、公共类型与安装出口                             |
| integration | Button 真实焦点、Enter/Space/鼠标一致性、表单、计算样式、三档布局、波纹生命周期；图标尺寸/颜色继承及多实例；Provider 隔离、Teleport、SSR/hydration 回归 |
| E2E         | 最小 dist 消费应用验证全量安装、按需按钮与图标组合、加载提交及浅色局部覆盖；不为六个图标各写一套 E2E                                                    |
| package     | ESM/CJS/声明、两个图标导出入口、禁用子路径、无 CSS 依赖、ESM tree shaking、dark 移除、npm 文件边界                                                      |

每个公共组件均有快速黑盒 unit 覆盖；集成 Fixture 与所属测试共置，共享资源放 tests/support。测试不访问组件私有状态，不以生成文件快照替代公共行为。资源转换额外验证几何保持和幂等生成。

实施完成运行 `pnpm type-check:test`、受影响的 `pnpm test:unit`、`pnpm test:integration`、`pnpm test:e2e`、`pnpm test:package`，以及源码/Storybook 类型检查、lint、格式检查。在变更说明记录四层适用性和实际结果。自动化浏览器测试沿用项目质量命令，不主动打开浏览器做手工页面验证。

## Risks / Trade-offs

- 公共变体、默认外观和主题路径变化 → 作为破坏性变更一次迁移类型、示例、规范和包 Fixture，不提供含糊的旧值回退别名。
- SVG 转换意外改变图形 → 保留路径几何与来源校验，按六个真实资源核对路径及截图；不按图标名寻找近似替代品。
- 聚合导出或 withInstall 保留未使用模块 → 用消费构建检查 tree shaking，必要时为纯包装添加正确纯调用标记，不新增单图标子路径。
- Figma 纯图标实例可能残留普通 minWidth 元数据 → 按其明确正方形说明和实际画面采用 iconOnly 专用尺寸，不照搬冲突属性。
- Figma 字体未安装时字形不同 → 提供字体栈与消费说明，库不捆绑大字体；尺寸契约与字体可用性分别验证。

## Migration Plan

1. 获取并版本化真实 SVG，生成并验证图标组件和公共入口。
2. 迁移 Button/主题类型、默认值和状态样式，更新所有 danger/default 调用；原 default 消费者选择 primary、primary+ghost 或 text 明确替代。
3. 移除 dark 的源码与消费依赖，更新文档和预览，保留主题覆盖测试。
4. 完成四层质量验证后交付可评审变更；本提案不授权发布 npm。
5. 如需回滚，整体回退本逻辑变更的代码、资源和导出映射，避免仅恢复别名造成类型与运行时不一致。

## 用户补充调整

Figma Icon 页 Loading 已从四个旋转变体收敛为单一组件，保留初始帧节点 20:2 和现有实例引用，删除其余变体及原型切换。应用侧继续使用 CSS 旋转。此调整按用户后续明确要求扩展原实施范围。
