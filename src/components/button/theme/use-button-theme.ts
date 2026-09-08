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
    const defaults: ButtonThemeTokens = {
      background: t.colorSurfaceRaised,
      backgroundHover: t.colorSurfaceHover,
      borderColor: t.colorBorderStrong,
      textColor: t.colorText,
      borderRadius: t.radiusMedium,
      gap: t.space2,
      duration: t.durationFast,
      spinDuration: t.durationSpin,
      disabledOpacity: t.opacityDisabled,
      fontWeight: t.fontWeightStrong,
      heightSmall: t.heightSmall,
      paddingSmall: t.space3,
      fontSizeSmall: t.fontSizeSmall,
      heightMedium: t.heightMedium,
      paddingMedium: t.space4,
      fontSizeMedium: t.fontSizeMedium,
      heightLarge: t.heightLarge,
      paddingLarge: t.space5,
      fontSizeLarge: t.fontSizeLarge,
      backgroundPrimary: t.colorPrimary,
      backgroundHoverPrimary: t.colorPrimaryHover,
      borderColorPrimary: t.colorPrimary,
      textColorPrimary: t.colorOnPrimary,
      backgroundSuccess: t.colorSuccess,
      backgroundHoverSuccess: t.colorSuccessHover,
      borderColorSuccess: t.colorSuccess,
      textColorSuccess: t.colorOnSuccess,
      backgroundWarning: t.colorWarning,
      backgroundHoverWarning: t.colorWarningHover,
      borderColorWarning: t.colorWarning,
      textColorWarning: t.colorOnWarning,
      backgroundDanger: t.colorDanger,
      backgroundHoverDanger: t.colorDangerHover,
      borderColorDanger: t.colorDanger,
      textColorDanger: t.colorOnDanger,
    }
    const tokens = mergeKnown(defaults, theme.components?.Button)
    const variant = props.variant ?? 'default'
    const suffix = variant === 'default' ? '' : variant[0]!.toUpperCase() + variant.slice(1)
    const size = props.size ?? 'medium'
    const sizeSuffix = size[0]!.toUpperCase() + size.slice(1)
    const value = (key: string) => tokens[key as keyof ButtonThemeTokens]
    return {
      '--s-button-background': value(`background${suffix}`),
      '--s-button-background-hover': value(`backgroundHover${suffix}`),
      '--s-button-border-color': value(`borderColor${suffix}`),
      '--s-button-text-color': value(`textColor${suffix}`),
      '--s-button-border-radius': tokens.borderRadius,
      '--s-button-gap': tokens.gap,
      '--s-button-duration': tokens.duration,
      '--s-button-spin-duration': tokens.spinDuration,
      '--s-button-disabled-opacity': tokens.disabledOpacity,
      '--s-button-font-weight': tokens.fontWeight,
      '--s-button-height': value(`height${sizeSuffix}`),
      '--s-button-padding': value(`padding${sizeSuffix}`),
      '--s-button-font-size': value(`fontSize${sizeSuffix}`),
    }
  })
}
