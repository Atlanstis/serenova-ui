import type { Plugin } from 'vue'

import { components } from './components'

const SerenovaUI: Plugin = {
  install(app) {
    components.forEach((component) => app.use(component))
  },
}

export { SButton } from './button'
export { buttonNativeTypes, buttonSizes, buttonVariants } from './button'
export type {
  ButtonEmits,
  ButtonNativeType,
  ButtonProps,
  ButtonSize,
  ButtonSlots,
  ButtonVariant,
} from './button'
export { SerenovaUI }
export default SerenovaUI
