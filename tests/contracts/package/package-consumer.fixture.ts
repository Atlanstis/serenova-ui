// 模拟第三方项目仅通过发布包公共入口消费组件与类型。
import type { App, Plugin } from 'vue'

import SerenovaUI, {
  buttonNativeTypes,
  buttonSizes,
  buttonVariants,
  SButton,
  type ButtonEmits,
  type ButtonNativeType,
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
const nativeType: ButtonNativeType = buttonNativeTypes[0]
const props = { nativeType, size, variant } satisfies ButtonProps
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
