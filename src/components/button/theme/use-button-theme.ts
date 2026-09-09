import { computed, inject } from 'vue'
import type { ButtonProps } from '../src/public-types'
import type { ButtonThemeTokens } from './types'
import { themeKey } from '../../../theme/context'
import { mergeKnown } from '../../../theme/resolve'
import { createButtonTokens } from './defaults'
import { lightPreset } from '../../../theme/presets/light'

export function useButtonTheme(props: Readonly<ButtonProps>) {
  const context = inject(themeKey, undefined)
  const resolved = computed(() => {
    const theme = context?.value ?? lightPreset
    // 无后缀字段代表 primary 基础覆盖；显式 Primary 字段优先。
    const overrides = theme.components?.Button
    const tokens = mergeKnown(createButtonTokens(theme.common), overrides)
    return { tokens, overrides }
  })
  return computed(() => {
    const { tokens, overrides } = resolved.value
    const variant = props.variant ?? 'primary'
    const suffix = variant[0]!.toUpperCase() + variant.slice(1)
    const get = (
      key:
        | 'background'
        | 'backgroundHover'
        | 'backgroundPressed'
        | 'backgroundDisabled'
        | 'borderColor'
        | 'textColor'
        | 'focusColor'
        | 'ghostColor'
        | 'textButtonColor'
        | 'textButtonColorHover'
        | 'textButtonColorPressed'
        | 'textButtonColorDisabled',
    ) => {
      const variantKey = `${key}${suffix}` as keyof ButtonThemeTokens
      return variant === 'primary'
        ? (overrides?.[variantKey] ?? overrides?.[key] ?? tokens[variantKey])
        : tokens[variantKey]
    }
    const text = !!props.text
    const ghost = !!props.ghost && !text
    const disabled = props.disabled || props.loading
    const foreground = disabled
      ? ghost
        ? get('backgroundDisabled')
        : text
          ? get('textButtonColorDisabled')
          : get('textColor')
      : text
        ? get('textButtonColor')
        : ghost
          ? get('ghostColor')
          : get('textColor')
    const size = props.size ?? 'medium'
    const sizeSuffix = size[0]!.toUpperCase() + size.slice(1)
    const sized = (key: string) => tokens[`${key}${sizeSuffix}` as keyof ButtonThemeTokens]
    return {
      '--s-button-background':
        ghost || text ? 'transparent' : disabled ? get('backgroundDisabled') : get('background'),
      '--s-button-background-hover': ghost || text ? 'transparent' : get('backgroundHover'),
      '--s-button-background-pressed': ghost || text ? 'transparent' : get('backgroundPressed'),
      '--s-button-border-color': text
        ? 'transparent'
        : ghost
          ? foreground
          : disabled
            ? get('backgroundDisabled')
            : get('borderColor'),
      '--s-button-text-color': foreground,
      '--s-button-text-color-hover': text ? get('textButtonColorHover') : foreground,
      '--s-button-text-color-pressed': text ? get('textButtonColorPressed') : foreground,
      '--s-button-focus-color': get('focusColor'),
      '--s-button-wave-color': ghost ? get('ghostColor') : get('background'),
      '--s-button-border-radius': tokens.borderRadius,
      '--s-button-gap': tokens.gap,
      '--s-button-duration': tokens.duration,
      '--s-button-spin-duration': tokens.spinDuration,
      '--s-button-disabled-opacity': tokens.disabledOpacity,
      '--s-button-font-weight': tokens.fontWeight,
      '--s-button-font-family': tokens.fontFamily,
      '--s-button-line-height': tokens.lineHeight,
      '--s-button-icon-size': tokens.iconSize,
      '--s-button-focus-width': tokens.focusWidth,
      '--s-button-focus-offset': tokens.focusOffset,
      '--s-button-wave-duration': tokens.waveDuration,
      '--s-button-wave-spread': tokens.waveSpread,
      '--s-button-shadow':
        variant === 'primary' && !ghost && !text && !disabled ? tokens.shadow : 'none',
      '--s-button-height': sized('height'),
      '--s-button-padding': props.iconOnly || text ? '0px' : sized('padding'),
      '--s-button-font-size': sized('fontSize'),
      '--s-button-min-width': props.iconOnly ? sized('height') : text ? '0px' : sized('minWidth'),
    }
  })
}
