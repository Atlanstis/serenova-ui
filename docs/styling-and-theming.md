# 样式与主题规范

公共组件使用局部 CSS 与实例级 CSS 变量。组件无需 Provider 即可使用 Figma 浅色默认值；全量和按需 CSS 不注入全局 :root token、不修改页面 color-scheme 或业务元素样式。

## 解析与边界

1. 显式 preset 优先，否则在 inherit=true 时继承父级，否则采用 lightPreset。
2. 当前 tokens.common 覆盖共享字段，undefined 不覆盖；输入对象不变。
3. Button 从共享值派生组件 token，再应用 components.Button 覆盖。
4. 显式 preset 或 inherit=false 清除父级覆盖；移除字段恢复基础值。

SThemeProvider 无 DOM 包装、无焦点和业务事件；主题按 Vue 上下文继承，Teleport 保持来源主题。独立应用不共享主题，服务端不同请求隔离，相同输入 SSR/hydration 一致。预设为纯数据，不引用组件实现或 CSS。

## 默认值与 Figma 映射

设计文件 RXjt6R6Hhaz4NJP8fYw533，Button 页面 3:60，状态面板 7:2，图标用法 75:307。资源映射见 assets/icons/manifest.json。

| 设计值                 | 共享字段或 Button 字段                                                                  | 默认值                                         |
| ---------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 品牌 / hover / pressed | colorPrimary / colorPrimaryHover / colorPrimaryPressed                                  | #7c3aed / #6d28d9 / #5b21b6                    |
| 警告 / hover / pressed | colorWarning / colorWarningHover / colorWarningPressed                                  | #f0b429 / #dea41d / #c58e12                    |
| 成功 / hover / pressed | colorSuccess / colorSuccessHover / colorSuccessPressed                                  | #34b27b / #299f6c / #21885c                    |
| 错误 / hover / pressed | colorError / colorErrorHover / colorErrorPressed                                        | #f06468 / #df5359 / #c9444b                    |
| 禁用背景               | colorPrimaryDisabled / colorWarningDisabled / colorSuccessDisabled / colorErrorDisabled | #aa92cd / #dfc58b / #93cbb2 / #e6abae          |
| 文字禁用 / accent      | colorTextDisabled / colorAccent                                                         | #a48cbf / #6d28d9                              |
| 高度                   | heightSmall / heightMedium / heightLarge                                                | 28 / 34 / 40 px                                |
| 水平内边距             | space3 / space4 / space5                                                                | 12 / 16 / 20 px                                |
| 最小宽度               | Button.minWidthSmall / Medium / Large                                                   | 64 / 80 / 96 px                                |
| 圆角 / 间距            | radiusMedium / space2                                                                   | 6 / 8 px                                       |
| 字体                   | Button.fontFamily / fontSize / fontWeight / lineHeight                                  | Noto Sans SC, sans-serif / 14 px / 500 / 20 px |
| 图标                   | Button.iconSize                                                                         | 16 px                                          |
| 焦点                   | Button.focusWidth / focusOffset                                                         | 2 / 2 px                                       |
| 波纹                   | Button.waveDuration / waveSpread                                                        | 600 ms / 5 px                                  |
| 加载旋转               | durationSpin                                                                            | 800 ms                                         |

完整共享类型见 src/theme/types.ts；完整组件字段及白名单见 src/components/button/theme/types.ts。组件颜色组包含 background、backgroundHover、backgroundPressed、backgroundDisabled、borderColor、textColor、focusColor、ghostColor，按 Primary/Warning/Success/Error 后缀区分。文字外观使用独立的 textButtonColor、textButtonColorHover、textButtonColorPressed、textButtonColorDisabled 颜色组，同样支持四种语义后缀。无后缀颜色字段表示 primary 基础覆盖，显式 Primary 后缀覆盖优先。

所有 token 均为字符串。CSS 变量映射位于 use-button-theme.ts：当前变体解析后输出 `--s-button-background` 等实例变量；消费端可通过原生 style 覆盖。新增 token 必须同步公共类型、白名单、默认派生、变量映射和契约测试。

## Button 状态与图标

variant 仅支持 primary/warning/success/error，默认 primary。text 和 ghost 是独立布尔属性，默认 false，可与任意语义类型组合；同时传入时 text 优先。文字外观保持透明背景、无描边、零水平内边距、无最小宽度，外层 gap 控制排列间距。iconOnly 固定为相应高度的正方形，仅显示 icon 槽。

普通按钮支持 icon/default/suffixIcon。图标缺省不占位，loading 隐藏前后业务图标、保留原文字，使用真实 Loading 图形。禁用及加载使用独立配色，实心保持白字，Ghost 保持透明底和对应禁用色。Loading 由 Button 旋转，独立 SIconLoading 保持静态。

可用原生按钮通过鼠标、Enter、Space 共用 click。focus-visible 显示类型焦点环；语义实心与 Ghost 激活产生外扩波纹，text 不产生。加载/禁用阻止业务事件和波纹，连续激活重启反馈；不无条件阻止原生事件。

图标是静态 SVG Vue 组件，size 默认 24、color 默认继承，Button 槽内使用 16 px。清理后的来源 SVG 与生成结果均提交仓库，不使用临时 URL、img、mask 或运行时 HTML 注入。生成器使用开发依赖 @xmldom/xmldom 严格解析 XML，未知结构拒绝转换。assets 中的 SVG 同样去除固定颜色，fill/stroke 使用 currentColor，保留 none 和透明度；通过组件 color 属性或外部 CSS color 控制颜色。

## 公共接入

```vue
<script setup lang="ts">
import { SButton } from 'serenova-ui/button'
import { SThemeProvider } from 'serenova-ui/theme-provider'
import { SIconAdd } from 'serenova-ui/icons'
import { lightPreset } from 'serenova-ui/themes/light'
import 'serenova-ui/button/style.css'
</script>
<template>
  <SThemeProvider :preset="lightPreset" :tokens="{ common: { colorPrimary: '#21885c' } }">
    <SButton
      ><template #icon><SIconAdd /></template>保存</SButton
    >
  </SThemeProvider>
</template>
```

图标同时从包根导出，支持默认插件注册及独立 app.use；独立图标无需 CSS。icons 集合是唯一图标子路径，不提供逐图标子路径。ESM 具名消费支持 tree shaking，CommonJS 保证正常加载。Button 仅依赖 Loading 图标。

## 迁移

- default 已移除，原调用方明确选择 primary、primary+ghost 或 text；省略 variant 时现在显示 primary。
- danger 改为 error；colorDanger、colorDangerHover、colorOnDanger 以及 Button 的 Danger 后缀改为 Error。
- 内置 darkPreset 与 themes/dark 入口已移除。使用默认浅色或自行定义 Provider 覆盖；保留自定义预设和局部隔离能力。
- 原先以整体透明度表示禁用的默认值改为 1，禁用状态采用专用背景色。
- 图标前槽保留，后槽为 suffixIcon；图标样式和业务文字由调用方提供，loading 不改写文案。

## Button 精简迁移与预览

- `block` 已从 ButtonProps 移除，普通满宽按钮改为 `<SButton style="width: 100%">继续</SButton>`，也可透传消费端 class。旧 JavaScript 调用传入 block 不再提供满宽布局，不新增运行时异常或兼容别名。
- 删除无效的 `ghostColorText` 配置即可；如需调整文字按钮正常颜色，显式设置 `textButtonColorPrimary`。四种语义 Ghost 配色字段继续有效，`disabledOpacity` 保留。
- Button Storybook 展示为基础用法、类型与外观、尺寸、禁用与加载、图标用法、交互反馈六项。Playground 与 Interaction 入口保持；Variants 改为 Appearance，SizesAndStates 拆为 Sizes 和 DisabledAndLoading，Slots 与 GhostAndIcons 合并为 Icons，Form 删除，旧链接需要更新。
- Button 通过原生 `type` 属性透传支持 button、submit、reset，未传时默认 button；Form 的删除仅影响展示，原生表单能力及自动化测试继续保留。
- 图标位置与文案 Controls 仅供展示，不属于 ButtonProps。纯图标模式提供默认图标；固定矩阵不显示无效 Controls。Tab、Enter、Space 和点击使用真实按钮交互。

## 验证

unit 验证公共输入输出、类型与导出；integration 验证真实样式、焦点、事件和主题协作；E2E 消费 dist 的全量/按需入口；package 检查 ESM/CJS/声明/CSS、导出边界、tree shaking 与 npm 文件。Storybook 仅承担预览和 Docs，不替代测试。

## 文字外观 API 迁移

`<SButton variant="text">` 改为 `<SButton text>`；错误色文字按钮写为 `<SButton variant="error" text>`。`buttonVariants` 与 `ButtonVariant` 仅包含四种语义类型。

删除原 `backgroundText`、`backgroundHoverText`、`backgroundPressedText`、`backgroundDisabledText`、`borderColorText`、`textColorText`、`focusColorText` 和 `textColorDisabled` 组件字段。文字背景与描边固定透明；旧 `textColorText` 迁移到 `textButtonColorPrimary`，旧 `textColorDisabled` 迁移到 `textButtonColorDisabledPrimary`，旧 `focusColorText` 迁移到 `focusColorPrimary`。原背景覆盖不再适用于文字外观。

`textButtonColor*` 使用正常、Hover、Pressed、Disabled 四种状态，加载复用 Disabled。无语义后缀字段仅覆盖 Primary，显式 Primary 后缀优先；如 `textButtonColorError` 只改变错误色文字外观，不影响实心或 Ghost 按钮。共享 `colorTextDisabled` 仍提供 Primary 文字禁用色，其他语义类型采用对应的禁用色。

### 文字按钮焦点环

`text && !iconOnly` 使用不参与布局的焦点伪元素，环绕内容四周保留 4px 内侧留白，默认 2px 描边、32px 高和 9px 圆角；三档按钮仍保持 28/34/40px 点击高度。内容高度由 `lineHeight` 与 `iconSize` 的较大值决定，焦点描边宽度与颜色沿用 `focusWidth` 和类型焦点色。`focusOffset` 用于普通、Ghost 和纯图标按钮的原生外环；文字内容外环采用固定 4px 内侧留白。

### 原生按钮类型迁移

`nativeType`、`ButtonNativeType` 和 `buttonNativeTypes` 已从公共 API 删除。将 `native-type="submit"` / `native-type="reset"` 改为 `type="submit"` / `type="reset"`，删除旧类型和常量导入。`type` 使用单根按钮的原生属性透传，不属于 ButtonProps；未传入时默认 button，移除透传属性后恢复 button。旧 nativeType 不再控制表单行为，不提供兼容别名。
