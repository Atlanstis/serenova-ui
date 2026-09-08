import Button from './src/Button.vue'
import { withInstall } from '../../shared/with-install'

export const SButton = /* @__PURE__ */ withInstall(Button, 'SButton')

export { buttonNativeTypes, buttonSizes, buttonVariants } from './src/public-types'
export type {
  ButtonEmits,
  ButtonNativeType,
  ButtonProps,
  ButtonSize,
  ButtonSlots,
  ButtonVariant,
} from './src/public-types'
