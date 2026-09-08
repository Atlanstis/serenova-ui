import type { VNode } from 'vue'

export const buttonVariants = ['primary', 'warning', 'success', 'error', 'text'] as const
export const buttonSizes = ['small', 'medium', 'large'] as const
export const buttonNativeTypes = ['button', 'submit', 'reset'] as const

export type ButtonVariant = (typeof buttonVariants)[number]
export type ButtonSize = (typeof buttonSizes)[number]
export type ButtonNativeType = (typeof buttonNativeTypes)[number]

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  ghost?: boolean
  iconOnly?: boolean
  block?: boolean
  disabled?: boolean
  loading?: boolean
  nativeType?: ButtonNativeType
}

export interface ButtonSlots {
  default?: () => VNode[]
  icon?: () => VNode[]
  suffixIcon?: () => VNode[]
}

export interface ButtonEmits {
  click: [event: MouseEvent]
}
