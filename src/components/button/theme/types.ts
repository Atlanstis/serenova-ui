export interface ButtonThemeTokens {
  background: string
  backgroundHover: string
  backgroundPressed: string
  backgroundDisabled: string
  borderColor: string
  textColor: string
  focusColor: string
  ghostColor: string
  borderRadius: string
  gap: string
  duration: string
  spinDuration: string
  disabledOpacity: string
  fontWeight: string
  fontFamily: string
  lineHeight: string
  iconSize: string
  focusWidth: string
  focusOffset: string
  waveDuration: string
  waveSpread: string
  shadow: string
  textColorDisabled: string
  heightSmall: string
  paddingSmall: string
  fontSizeSmall: string
  minWidthSmall: string
  heightMedium: string
  paddingMedium: string
  fontSizeMedium: string
  minWidthMedium: string
  heightLarge: string
  paddingLarge: string
  fontSizeLarge: string
  minWidthLarge: string
  backgroundPrimary: string
  backgroundHoverPrimary: string
  backgroundPressedPrimary: string
  backgroundDisabledPrimary: string
  borderColorPrimary: string
  textColorPrimary: string
  focusColorPrimary: string
  ghostColorPrimary: string
  backgroundWarning: string
  backgroundHoverWarning: string
  backgroundPressedWarning: string
  backgroundDisabledWarning: string
  borderColorWarning: string
  textColorWarning: string
  focusColorWarning: string
  ghostColorWarning: string
  backgroundSuccess: string
  backgroundHoverSuccess: string
  backgroundPressedSuccess: string
  backgroundDisabledSuccess: string
  borderColorSuccess: string
  textColorSuccess: string
  focusColorSuccess: string
  ghostColorSuccess: string
  backgroundError: string
  backgroundHoverError: string
  backgroundPressedError: string
  backgroundDisabledError: string
  borderColorError: string
  textColorError: string
  focusColorError: string
  ghostColorError: string
  backgroundText: string
  backgroundHoverText: string
  backgroundPressedText: string
  backgroundDisabledText: string
  borderColorText: string
  textColorText: string
  focusColorText: string
  ghostColorText: string
}

export const buttonThemeKeys = [
  'background',
  'backgroundHover',
  'backgroundPressed',
  'backgroundDisabled',
  'borderColor',
  'textColor',
  'focusColor',
  'ghostColor',
  'borderRadius',
  'gap',
  'duration',
  'spinDuration',
  'disabledOpacity',
  'fontWeight',
  'fontFamily',
  'lineHeight',
  'iconSize',
  'focusWidth',
  'focusOffset',
  'waveDuration',
  'waveSpread',
  'shadow',
  'textColorDisabled',
  'heightSmall',
  'paddingSmall',
  'fontSizeSmall',
  'minWidthSmall',
  'heightMedium',
  'paddingMedium',
  'fontSizeMedium',
  'minWidthMedium',
  'heightLarge',
  'paddingLarge',
  'fontSizeLarge',
  'minWidthLarge',
  'backgroundPrimary',
  'backgroundHoverPrimary',
  'backgroundPressedPrimary',
  'backgroundDisabledPrimary',
  'borderColorPrimary',
  'textColorPrimary',
  'focusColorPrimary',
  'ghostColorPrimary',
  'backgroundWarning',
  'backgroundHoverWarning',
  'backgroundPressedWarning',
  'backgroundDisabledWarning',
  'borderColorWarning',
  'textColorWarning',
  'focusColorWarning',
  'ghostColorWarning',
  'backgroundSuccess',
  'backgroundHoverSuccess',
  'backgroundPressedSuccess',
  'backgroundDisabledSuccess',
  'borderColorSuccess',
  'textColorSuccess',
  'focusColorSuccess',
  'ghostColorSuccess',
  'backgroundError',
  'backgroundHoverError',
  'backgroundPressedError',
  'backgroundDisabledError',
  'borderColorError',
  'textColorError',
  'focusColorError',
  'ghostColorError',
  'backgroundText',
  'backgroundHoverText',
  'backgroundPressedText',
  'backgroundDisabledText',
  'borderColorText',
  'textColorText',
  'focusColorText',
  'ghostColorText',
] as const satisfies readonly (keyof ButtonThemeTokens)[]
