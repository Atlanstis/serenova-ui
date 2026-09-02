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
