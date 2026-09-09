import type { ThemeTokens } from '../../../theme/types'
import type { ButtonThemeTokens } from './types'

export function createButtonTokens(t: Readonly<ThemeTokens>): ButtonThemeTokens {
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
  return defaults
}
