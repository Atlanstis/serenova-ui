import { computed, inject } from 'vue'
import type { ButtonProps } from '../src/public-types'
import type { ButtonThemeTokens } from './types'
import { themeKey } from '../../../theme/context'
import { mergeKnown } from '../../../theme/resolve'
import { lightPreset } from '../../../theme/presets/light'

export function useButtonTheme(props: Readonly<ButtonProps>) {
  const context = inject(themeKey, undefined)
  return computed(() => {
    const theme = context?.value ?? lightPreset
    const t = theme.common
    const primary = {
      background: t.colorPrimary,
      backgroundHover: t.colorPrimaryHover,
      backgroundPressed: t.colorPrimaryPressed,
      backgroundDisabled: t.colorPrimaryDisabled,
      borderColor: t.colorPrimary,
      textColor: t.colorOnPrimary,
      focusColor: t.colorPrimaryFocus,
      ghostColor: t.colorAccent,
    }
    const semantic = (
      color: string,
      hover: string,
      pressed: string,
      disabled: string,
      text: string,
    ) => ({
      background: color,
      backgroundHover: hover,
      backgroundPressed: pressed,
      backgroundDisabled: disabled,
      borderColor: color,
      textColor: text,
      focusColor: color,
      ghostColor: color,
    })
    const variants = {
      Primary: primary,
      Warning: semantic(
        t.colorWarning,
        t.colorWarningHover,
        t.colorWarningPressed,
        t.colorWarningDisabled,
        t.colorOnWarning,
      ),
      Success: semantic(
        t.colorSuccess,
        t.colorSuccessHover,
        t.colorSuccessPressed,
        t.colorSuccessDisabled,
        t.colorOnSuccess,
      ),
      Error: semantic(
        t.colorError,
        t.colorErrorHover,
        t.colorErrorPressed,
        t.colorErrorDisabled,
        t.colorOnError,
      ),
    }
    const defaults = {
      ...primary,
      borderRadius: t.radiusMedium,
      gap: t.space2,
      duration: t.durationFast,
      spinDuration: t.durationSpin,
      disabledOpacity: t.opacityDisabled,
      fontWeight: t.fontWeightStrong,
      fontFamily: "'Noto Sans SC', sans-serif",
      lineHeight: '20px',
      iconSize: '16px',
      focusWidth: '2px',
      focusOffset: '2px',
      waveDuration: '600ms',
      waveSpread: '5px',
      shadow: '0 2px 3px rgba(64, 38, 102, 0.08)',
      heightSmall: t.heightSmall,
      paddingSmall: t.space3,
      fontSizeSmall: t.fontSizeSmall,
      minWidthSmall: '64px',
      heightMedium: t.heightMedium,
      paddingMedium: t.space4,
      fontSizeMedium: t.fontSizeMedium,
      minWidthMedium: '80px',
      heightLarge: t.heightLarge,
      paddingLarge: t.space5,
      fontSizeLarge: t.fontSizeLarge,
      minWidthLarge: '96px',
    } as ButtonThemeTokens
    for (const [variant, values] of Object.entries(variants)) {
      for (const [key, value] of Object.entries(values)) {
        defaults[`${key}${variant}` as keyof ButtonThemeTokens] = value
      }
    }
    for (const [variant, values] of Object.entries(variants)) {
      const colors = {
        textButtonColor: values.ghostColor,
        textButtonColorHover: values.backgroundHover,
        textButtonColorPressed: values.backgroundPressed,
        textButtonColorDisabled:
          variant === 'Primary' ? t.colorTextDisabled : values.backgroundDisabled,
      }
      for (const [key, value] of Object.entries(colors)) {
        defaults[`${key}${variant}` as keyof ButtonThemeTokens] = value
        if (variant === 'Primary') defaults[key as keyof ButtonThemeTokens] = value
      }
    }
    // 无后缀字段代表 primary 基础覆盖；显式 Primary 字段优先。
    const overrides = theme.components?.Button
    const tokens = mergeKnown(defaults, overrides)
    const variant = props.variant ?? 'primary'
    const suffix = variant[0]!.toUpperCase() + variant.slice(1)
    const get = (
      key:
        | keyof typeof primary
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
