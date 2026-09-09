// 模拟第三方项目仅通过发布包公共入口消费组件与类型。
import type { App, Plugin } from 'vue'

import SerenovaUI, {
  buttonSizes,
  buttonVariants,
  SButton,
  type ButtonEmits,
  type ButtonProps,
  type ButtonSize,
  type ButtonSlots,
  type ButtonVariant,
} from 'serenova-ui'

// @ts-expect-error 组件注册表属于内部实现，不是包根公共 API。
import { components } from 'serenova-ui'

const plugin: Plugin = SerenovaUI
const installComponents = (app: App) => {
  app.use(plugin)
  app.use(SButton)
}

const variant: ButtonVariant = buttonVariants[0]
const size: ButtonSize = buttonSizes[0]
const props = { size, variant } satisfies ButtonProps
const slots = { default: () => [] } satisfies ButtonSlots
const clickArguments: ButtonEmits['click'] = [new MouseEvent('click')]

void [clickArguments, components, installComponents, props, slots]

import { SButton as IndividualButton } from 'serenova-ui/button'
import {
  SThemeProvider,
  type ThemeOverrides,
  type ThemePreset,
  type ThemeTokens,
  type ButtonThemeTokens,
  type ThemeProviderProps,
} from 'serenova-ui/theme-provider'
import { lightPreset } from 'serenova-ui/themes/light'
import type { ThemeProviderProps as RootThemeProviderProps } from 'serenova-ui'

const theme: ThemePreset = lightPreset
const common: ThemeTokens = lightPreset.common
const buttonTokens: Partial<ButtonThemeTokens> = { borderRadius: '12px' }
const tokens: ThemeOverrides = { components: { Button: buttonTokens } }
const providerProps: RootThemeProviderProps & ThemeProviderProps = {
  preset: theme,
  tokens,
  inherit: false,
}
const providerPlugin: Plugin = SThemeProvider
void [IndividualButton, providerProps, providerPlugin, common]

import {
  SIconAdd,
  SIconDelete,
  SIconEdit,
  SIconSearch,
  SIconArrowRight,
  SIconLoading,
  type IconProps,
} from 'serenova-ui/icons'
import { SIconAdd as RootAdd, type IconProps as RootIconProps } from 'serenova-ui'
const iconProps: IconProps & RootIconProps = { size: '2em', color: '#123456' }
const iconPlugins: Plugin[] = [
  SIconAdd,
  SIconDelete,
  SIconEdit,
  SIconSearch,
  SIconArrowRight,
  SIconLoading,
  RootAdd,
]
// @ts-expect-error default 变体已移除。
const oldDefault: ButtonVariant = 'default'
// @ts-expect-error danger 改为 error。
const oldDanger: ButtonVariant = 'danger'
void [iconProps, iconPlugins, oldDefault, oldDanger]

// 公开字段删除同时约束根入口和单组件入口。
import type { ButtonProps as IndividualButtonProps } from 'serenova-ui/button'
import type { ButtonThemeTokens as RootButtonThemeTokens } from 'serenova-ui'
// @ts-expect-error block 已移除，满宽使用消费端 class/style。
const removedBlock: ButtonProps = { block: true }
// @ts-expect-error 单组件入口也不提供 block。
const removedIndividualBlock: IndividualButtonProps = { block: true }
// @ts-expect-error 文字按钮不使用 Ghost 配色。
const removedGhostText: Partial<ButtonThemeTokens> = { ghostColorText: '#123456' }
// @ts-expect-error 根入口也不提供该无效字段。
const removedRootGhostText: Partial<RootButtonThemeTokens> = { ghostColorText: '#123456' }
const retainedButtonProps: IndividualButtonProps = {
  ghost: true,
  iconOnly: true,
}
const retainedColors: Partial<RootButtonThemeTokens> = {
  textButtonColorPrimary: '#123456',
  ghostColorPrimary: '#654321',
}
void [
  removedBlock,
  removedIndividualBlock,
  removedGhostText,
  removedRootGhostText,
  retainedButtonProps,
  retainedColors,
]

const errorText = { variant: 'error', text: true } satisfies ButtonProps & IndividualButtonProps
// @ts-expect-error text 已移出语义类型。
const legacyText: ButtonVariant = 'text'
// @ts-expect-error 旧文字类型字段已删除。
const legacyTextColor: Partial<ButtonThemeTokens> = { textColorText: '#123456' }
void [errorText, legacyText, legacyTextColor]

// @ts-expect-error 根入口已移除原生类型常量。
import { buttonNativeTypes as removedNativeTypes } from 'serenova-ui'
// @ts-expect-error 单组件入口已移除原生类型常量。
import { buttonNativeTypes as removedIndividualNativeTypes } from 'serenova-ui/button'
// @ts-expect-error 根入口已移除原生类型别名。
import type { ButtonNativeType as RemovedNativeType } from 'serenova-ui'
// @ts-expect-error 单组件入口已移除原生类型别名。
import type { ButtonNativeType as RemovedIndividualNativeType } from 'serenova-ui/button'
// @ts-expect-error 原生类型改用 type 属性透传。
const removedNativeProp: ButtonProps = { nativeType: 'submit' }
// @ts-expect-error 单组件入口也不支持旧 Prop。
const removedIndividualNativeProp: IndividualButtonProps = { nativeType: 'reset' }
// @ts-expect-error type 不是新增的组件 Prop。
const nativeAttrIsNotProp: ButtonProps = { type: 'submit' }
const removedTypes: [RemovedNativeType, RemovedIndividualNativeType] = ['button', 'reset']
void [
  removedNativeTypes,
  removedIndividualNativeTypes,
  removedNativeProp,
  removedIndividualNativeProp,
  nativeAttrIsNotProp,
  removedTypes,
]
