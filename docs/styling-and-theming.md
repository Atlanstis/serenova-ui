# 样式组织与主题实现规范

本文是 Serenova UI 样式与主题方案的唯一真实来源，定义模块职责、公共接口、主题解析、样式发布与设计映射。相关实现、测试和使用说明必须与本文保持一致；方案调整先更新本文，再同步实现与验证。

## 架构与职责

样式体系由按组件发布的静态 CSS、无 DOM 的 `SThemeProvider`、主题数据与组件主题解析组成。

```text
默认主题 / 主题预设
        │
        ▼
SThemeProvider ← 父主题上下文 + 当前覆盖
        │ 只读响应式上下文
        ▼
组件主题解析 ← 无上下文时使用默认主题
        │
        ▼
组件自身 CSS Variables + 组件静态 CSS
        │
        ▼
布局、颜色、尺寸、交互状态与动画
```

| 模块           | 职责                                         |
| -------------- | -------------------------------------------- |
| 主题数据       | 定义共享 token、默认浅色预设和暗色预设       |
| SThemeProvider | 解析主题基础、合并覆盖、提供只读响应式上下文 |
| 组件主题解析   | 根据共享 token 与组件覆盖生成所需变量        |
| 组件静态 CSS   | 定义布局、状态选择器和动画，引用组件变量     |
| 发布构建       | 输出组件 JS、类型、独立 CSS 与全量 CSS       |

主题数据与预设仅依赖数据和类型，不引用组件实现或结构样式。Provider 不集中加载全部组件的主题解析器。每个组件仅解析自身需要的 token。

## 源码组织

```text
src/
├── components/
│   ├── button/
│   │   ├── src/        # Vue 组件与行为类型
│   │   ├── theme/      # 组件 token 类型、字段定义与解析
│   │   ├── stories/
│   │   └── index.ts
│   └── theme-provider/
│       ├── src/
│       ├── stories/
│       └── index.ts
├── theme/
│   ├── presets/        # light 与 dark 纯数据预设
│   ├── context.ts
│   ├── resolve.ts
│   └── types.ts
├── shared/
│   └── with-install.ts
├── plugin.ts
└── index.ts
```

公共 Vue 组件统一放入 `components/`。组件专属主题类型、字段白名单和解析归组件领域；主题基础设施通过类型引用组合公共主题结构，仅引用必要的字段数据，不加载组件渲染实现或组件解析器。

`theme/` 管理共享配置及预设，`shared/` 管理跨领域内部辅助。`plugin.ts` 维护全量安装列表，`index.ts` 仅组织公共导出。源码 Story 通过 SFC 加载样式，不设置空 CSS 占位入口。

构建分别映射内部源码路径与外部公共子路径；内部目录调整不改变 `serenova-ui/button`、`serenova-ui/theme-provider` 或 `serenova-ui/themes/*` 等消费路径。测试保留在仓库的 `tests/` 目录。

## 主题数据模型

### Token 分层

共享 token 表达颜色、间距、圆角、字体和动效等设计语义；组件 token 表达具体组件的背景、文本、尺寸和状态值。

共享 token 是组件默认值的输入。组件解析函数接收合并后的共享 token，生成组件默认值，再应用组件级覆盖。共享 token 与组件 token 使用稳定的语义名称，临时计算变量不自动成为公共接口。

颜色状态使用独立语义字段；修改主色仅影响引用该主色的组件值，不自动生成 hover 或其他色阶。

### 公共类型

| 类型                 | 内容                                     |
| -------------------- | ---------------------------------------- |
| `ThemeTokens`        | 完整共享 token 字段                      |
| `ButtonThemeTokens`  | Button 的组件 token 字段                 |
| `ThemeOverrides`     | 可选的共享 token 覆盖与按组件组织的覆盖  |
| `ThemePreset`        | 完整共享 token、预设标识及可选组件覆盖   |
| `ThemeProviderProps` | Provider 的 preset、tokens、inherit 输入 |

`ThemeOverrides` 的字段结构为：

```ts
interface ThemeOverrides {
  common?: Partial<ThemeTokens>
  components?: {
    Button?: Partial<ButtonThemeTokens>
  }
}
```

新增组件时扩展对应组件 token 类型和 `components` 映射。预设中的组件覆盖使用相同结构。

默认值和预设维护为类型化、可序列化的数据。颜色使用合法 CSS 颜色值；长度与时长保留单位。合并只处理已声明字段，忽略值为 `undefined` 的字段，不修改调用方对象、父主题或预设。`null` 不属于公共输入类型，也不表示重置。

### 共享 token 默认值

预设的 `name` 分别为 `light` 和 `dark`。所有值均为字符串；表中暗色与浅色相同时共用同一默认值。

| 字段                 | 浅色      | 暗色      |
| -------------------- | --------- | --------- |
| `colorPrimary`       | `#155eef` | `#84adff` |
| `colorPrimaryHover`  | `#004eeb` | `#b2ccff` |
| `colorOnPrimary`     | `#ffffff` | `#102a56` |
| `colorSuccess`       | `#067647` | `#75e0a7` |
| `colorSuccessHover`  | `#085d3a` | `#a6f4c5` |
| `colorOnSuccess`     | `#ffffff` | `#053321` |
| `colorWarning`       | `#b54708` | `#fec84b` |
| `colorWarningHover`  | `#93370d` | `#fedf89` |
| `colorOnWarning`     | `#ffffff` | `#4e1d09` |
| `colorDanger`        | `#d92d20` | `#fda29b` |
| `colorDangerHover`   | `#b42318` | `#fecdca` |
| `colorOnDanger`      | `#ffffff` | `#55160c` |
| `colorText`          | `#182230` | `#f9fafb` |
| `colorTextMuted`     | `#475467` | `#d0d5dd` |
| `colorSurface`       | `#ffffff` | `#101828` |
| `colorSurfaceRaised` | `#ffffff` | `#1d2939` |
| `colorSurfaceHover`  | `#f2f4f7` | `#344054` |
| `colorBorder`        | `#e4e7ec` | `#344054` |
| `colorBorderStrong`  | `#98a2b3` | `#667085` |
| `radiusMedium`       | `8px`     | `8px`     |
| `space2`             | `8px`     | `8px`     |
| `space3`             | `12px`    | `12px`    |
| `space4`             | `16px`    | `16px`    |
| `space5`             | `20px`    | `20px`    |
| `durationFast`       | `150ms`   | `150ms`   |
| `heightSmall`        | `30px`    | `30px`    |
| `heightMedium`       | `38px`    | `38px`    |
| `heightLarge`        | `46px`    | `46px`    |
| `fontSizeSmall`      | `13px`    | `13px`    |
| `fontSizeMedium`     | `14px`    | `14px`    |
| `fontSizeLarge`      | `16px`    | `16px`    |
| `fontWeightStrong`   | `600`     | `600`     |
| `opacityDisabled`    | `0.55`    | `0.55`    |
| `durationSpin`       | `0.7s`    | `0.7s`    |

### Button token 与变量

颜色字段 `background`、`backgroundHover`、`borderColor`、`textColor` 用于 default 变体；其他变体在字段末尾添加 `Primary`、`Success`、`Warning` 或 `Danger`，例如 `backgroundPrimary`。每组字段分别映射该语义颜色、hover 色、边框颜色和前景色。default 使用 surfaceRaised、surfaceHover、borderStrong 和 text。

| 组件 token                                     | 默认来源                 | 元素变量                      |
| ---------------------------------------------- | ------------------------ | ----------------------------- |
| 当前变体的 background                          | 对应共享颜色             | `--s-button-background`       |
| 当前变体的 backgroundHover                     | 对应 hover 颜色          | `--s-button-background-hover` |
| 当前变体的 borderColor                         | 对应边框颜色             | `--s-button-border-color`     |
| 当前变体的 textColor                           | 对应前景色               | `--s-button-text-color`       |
| borderRadius                                   | radiusMedium             | `--s-button-border-radius`    |
| gap                                            | space2                   | `--s-button-gap`              |
| duration                                       | durationFast             | `--s-button-duration`         |
| spinDuration                                   | durationSpin             | `--s-button-spin-duration`    |
| disabledOpacity                                | opacityDisabled          | `--s-button-disabled-opacity` |
| fontWeight                                     | fontWeightStrong         | `--s-button-font-weight`      |
| heightSmall / heightMedium / heightLarge       | 同名共享值               | `--s-button-height`           |
| paddingSmall / paddingMedium / paddingLarge    | space3 / space4 / space5 | `--s-button-padding`          |
| fontSizeSmall / fontSizeMedium / fontSizeLarge | 同名共享值               | `--s-button-font-size`        |

尺寸变量根据 size 选择，颜色变量根据 variant 选择。以上元素变量均可通过元素级 style 覆盖；Provider 的 components.Button 覆盖使用表中的 token 字段。Button 的 pressed 状态使用位移反馈，不增加单独的 pressed 颜色字段。

## SThemeProvider

### 公共接口

| 输入      | 默认值      | 行为                                   |
| --------- | ----------- | -------------------------------------- |
| `preset`  | `undefined` | 指定完整主题基础，并截断父主题及父覆盖 |
| `tokens`  | `undefined` | 对主题基础应用共享和组件级部分覆盖     |
| `inherit` | `true`      | 未指定 preset 时是否继承父主题         |
| 默认插槽  | 无          | 输出子内容，保持子项顺序               |

Provider 使用 Vue Composition API 和类型化 `provide/inject`。上下文向子组件提供只读响应式数据，配置变化由 Props 驱动。

Provider 不渲染 DOM 容器，不提供 `tag`、DOM ref 或业务事件，不增加可聚焦元素，不注册鼠标、键盘或焦点处理。`class`、`style` 和其他 attrs 不自动透传到任意插槽子项。

### 解析顺序

1. 显式传入 `preset` 时，以该预设为基础，忽略父主题和父覆盖。
2. 未传入预设、`inherit=true` 且存在父上下文时，以父主题为基础。
3. 其他情况以默认浅色主题为基础。
4. 按字段合并当前 `tokens.common`，得到最终共享 token。
5. 合并基础主题和当前 `tokens.components` 的组件覆盖，保留尚未派生的覆盖数据。
6. 组件使用最终共享 token 生成默认组件值，再应用合并后的组件覆盖。

显式预设和 `inherit=false` 都清除父级共享覆盖与组件覆盖的影响。重新选择预设时仍应用当前 Provider 自身的 tokens。移除覆盖字段后，重新从基础主题解析，不能保留上一次计算结果。

父上下文保存共享值与组件覆盖，不把已派生的组件默认值当作覆盖继续传递，保证内层修改共享 token 后组件默认值可以重新计算。

## 组件变量与样式

组件从主题上下文读取配置；没有 Provider 时，直接使用默认主题并执行相同解析流程，不要求额外加载共享 token CSS。

解析结果绑定到组件自身的样式宿主节点。单根组件使用根元素；多个独立渲染根需要分别绑定各自使用的变量。每个组件只输出自身所需变量，名称包含组件领域，例如 `--s-button-background`、`--s-button-text-color`。

布局、状态选择器、动画和变量引用保留在 Vue SFC 的 scoped CSS 中。模板只绑定已解析结果，不散落主题合并逻辑。主题切换更新变量，不重新挂载组件，不改变业务状态或事件路径。

组件继续接收使用者的 `class` 和 `style`。元素级 `style` 对明确公开的同名变量具有最终覆盖优先级。主题选择通过 Provider 输入完成，祖先全局变量不作为主题配置协议。

静态 CSS 不向 `:root` 注入主题，不通过全局 `[data-theme]` 选择器切换主题，不包含影响宿主页面的全局 reset。需要 `color-scheme` 时仅设置到组件作用范围。

## 静态 CSS 与模块发布

### 公共入口

| 路径                           | 导出内容                                    |
| ------------------------------ | ------------------------------------------- |
| `serenova-ui`                  | 默认安装插件、公共组件、Provider 和公共类型 |
| `serenova-ui/style.css`        | 全量组件静态样式                            |
| `serenova-ui/button`           | SButton 与对应公共类型                      |
| `serenova-ui/button/style.css` | Button 全部状态及必要依赖样式               |
| `serenova-ui/theme-provider`   | SThemeProvider 与公共主题类型               |
| `serenova-ui/themes/light`     | lightPreset 及对应类型                      |
| `serenova-ui/themes/dark`      | darkPreset 及对应类型                       |

普通 JS 入口提供 ESM、CommonJS 和 TypeScript 声明，不包含 CSS import 或 require，可在 Node 中直接加载。Provider 无视觉规则，不提供独立 CSS。消费方显式导入所需组件 CSS 或全量 CSS。

### 构建规则

构建使用 Vite 多入口并启用 CSS 拆分，建立公共入口与输出文件的确定映射。内部文件名可以变化，公共子路径保持稳定。

每个组件 CSS 覆盖该组件全部运行时 variant、尺寸、交互状态和动画。组合组件的样式入口包含内部组件的必要样式依赖，消费方不需要了解内部组成。

提取的共享 CSS 必须随组件入口可解析地加载，或合并进对应输出。全量 CSS 从同一批组件规则聚合，保证规则来源与 scoped 标识一致，不维护另一套手工复制的样式。

CSS 资源在包元数据中标记为副作用。未使用组件的规则、Storybook 样式、测试资产和文档不进入对应组件 CSS；发布包仅包含约定的消费产物与包元数据。

## 使用方式

### 按需使用与嵌套主题

```vue
<script setup lang="ts">
import { SButton } from 'serenova-ui/button'
import { SThemeProvider } from 'serenova-ui/theme-provider'
import { darkPreset } from 'serenova-ui/themes/dark'
import 'serenova-ui/button/style.css'
</script>

<template>
  <SButton>默认主题</SButton>

  <SThemeProvider :preset="darkPreset">
    <SButton>暗色主题</SButton>
    <SThemeProvider :tokens="{ common: { colorPrimary: '#7c3aed' } }">
      <SButton variant="primary">局部主色</SButton>
    </SThemeProvider>
    <SThemeProvider :inherit="false">
      <SButton>默认浅色主题</SButton>
    </SThemeProvider>
  </SThemeProvider>
</template>
```

### 组件级覆盖

```ts
import type { ThemeOverrides } from 'serenova-ui/theme-provider'

const tokens: ThemeOverrides = {
  common: {
    colorPrimary: '#7c3aed',
  },
  components: {
    Button: {
      borderRadius: '12px',
    },
  },
}
```

将该对象传入 Provider 的 `tokens`，其主题范围内的 Button 使用指定圆角，其他组件不受该组件覆盖影响。

### 全量使用

```ts
import { createApp } from 'vue'
import SerenovaUI from 'serenova-ui'
import 'serenova-ui/style.css'
import App from './App.vue'

createApp(App).use(SerenovaUI).mount('#app')
```

在应用中通过 Provider 的 `preset` 切换主题。独立主题预设按需导入，不由 Provider 静态引用全部预设。

## Teleport、独立应用与 SSR

主题归属按 Vue 组件上下文确定。Teleport 改变 DOM 位置后，组件继续使用原上下文，并在传送后的节点应用自己的变量。多个主题作用域可以同时存在，更新一个作用域不修改其他作用域。

独立创建的应用没有原组件树的主题上下文，默认使用浅色主题。命令式创建组件时，需要显式连接相应主题配置，不能根据 DOM 挂载目标猜测主题归属。

无 DOM Provider 不给普通业务元素注入变量。组件变量遵循 CSS 的作用域、层叠与继承规则，不提供对宿主 CSS 的完全隔离。

主题解析不读取浏览器全局对象，也不依赖挂载钩子初始化。SSR 将变量随组件 HTML 输出，消费应用负责加载静态 CSS。各组件树的配置相互隔离，不使用可变全局主题单例。服务端与客户端使用相同输入时，初始主题和 hydration 结果保持一致。

## Figma Dev Mode 映射

设计与代码使用同一份版本化 token 数据。默认浅色与暗色预设对应主题模式；共享 token 与组件 token 使用稳定语义名。映射记录同时包含设计名称、主题字段、CSS 名称和生效作用域。

| Figma 语义          | 主题字段                         | 运行时用途                              |
| ------------------- | -------------------------------- | --------------------------------------- |
| `color/primary`     | `common.colorPrimary`            | 参与组件主色值解析                      |
| `button/background` | `components.Button.background`   | 组件节点上的 `--s-button-background`    |
| `button/radius`     | `components.Button.borderRadius` | 组件节点上的 `--s-button-border-radius` |

Code Syntax 引用实际输出且在目标节点有效的变量。未直接输出为 CSS 的共享 token 不配置虚构的 CSS 变量表达式；组件局部变量不作为任意业务节点可用的全局变量。

Code Connect 展示真实组件 API 与公共导入方式。设计组件属性映射到 Props 和 Slots；hover、pressed、focus 描述交互状态，不因此增加业务 Props。字体、阴影等复合 token 按其字段定义转换规则。

## 验证要求

| 层级            | 验证内容                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------- |
| unit 与类型检查 | Props/defaults、插槽顺序、无 DOM 包装、公开类型与出口、输入不变性、默认主题和 SSR 请求隔离  |
| integration     | 计算样式、主题切换、嵌套与重置、覆盖移除、兄弟隔离、Teleport、hydration、鼠标键盘与焦点行为 |
| E2E             | 从 dist 公共入口加载全量与按需样式，验证主题切换和关键组件操作                              |
| package         | ESM/CommonJS、类型声明、公共子路径、CSS 依赖、无关规则排除、预设依赖图及 npm 文件边界       |

默认消费必须仅凭组件入口与组件 CSS 获得完整外观。按需构建通过包含无关测试入口的最小 Fixture 验证样式排除，不以单组件产物推断裁剪正确性。

实施验证运行测试类型检查与所有受影响的 `test:unit`、`test:integration`、`test:e2e`、`test:package` 命令，并记录实际结果。
