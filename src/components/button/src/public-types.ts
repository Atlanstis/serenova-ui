import type { VNode } from 'vue'

export const buttonVariants = ['primary', 'warning', 'success', 'error'] as const
export const buttonSizes = ['small', 'medium', 'large'] as const

export type ButtonVariant = (typeof buttonVariants)[number]
export type ButtonSize = (typeof buttonSizes)[number]

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  text?: boolean
  ghost?: boolean
  iconOnly?: boolean
  disabled?: boolean
  loading?: boolean
}

export interface ButtonSlots {
  default?: () => VNode[]
  icon?: () => VNode[]
  suffixIcon?: () => VNode[]
}

export interface ButtonEmits {
  click: [event: MouseEvent]
}
