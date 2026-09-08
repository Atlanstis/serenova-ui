import type { ButtonThemeTokens } from '../components/button/theme/types'
export type { ButtonThemeTokens } from '../components/button/theme/types'

export interface ThemeTokens {
  colorPrimary: string
  colorPrimaryHover: string
  colorOnPrimary: string
  colorSuccess: string
  colorSuccessHover: string
  colorOnSuccess: string
  colorWarning: string
  colorWarningHover: string
  colorOnWarning: string
  colorDanger: string
  colorDangerHover: string
  colorOnDanger: string
  colorText: string
  colorTextMuted: string
  colorSurface: string
  colorSurfaceRaised: string
  colorSurfaceHover: string
  colorBorder: string
  colorBorderStrong: string
  radiusMedium: string
  space2: string
  space3: string
  space4: string
  space5: string
  durationFast: string
  heightSmall: string
  heightMedium: string
  heightLarge: string
  fontSizeSmall: string
  fontSizeMedium: string
  fontSizeLarge: string
  fontWeightStrong: string
  opacityDisabled: string
  durationSpin: string
}

export interface ThemeOverrides {
  common?: Partial<ThemeTokens>
  components?: { Button?: Partial<ButtonThemeTokens> }
}

export interface ThemePreset {
  name: string
  common: Readonly<ThemeTokens>
  components?: ThemeOverrides['components']
}

export interface ThemeProviderProps {
  preset?: ThemePreset
  tokens?: ThemeOverrides
  inherit?: boolean
}
