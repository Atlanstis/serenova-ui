export interface ButtonThemeTokens {
  background: string
  backgroundHover: string
  borderColor: string
  textColor: string
  borderRadius: string
  gap: string
  duration: string
  spinDuration: string
  disabledOpacity: string
  fontWeight: string
  heightSmall: string
  paddingSmall: string
  fontSizeSmall: string
  heightMedium: string
  paddingMedium: string
  fontSizeMedium: string
  heightLarge: string
  paddingLarge: string
  fontSizeLarge: string
  backgroundPrimary: string
  backgroundHoverPrimary: string
  borderColorPrimary: string
  textColorPrimary: string
  backgroundSuccess: string
  backgroundHoverSuccess: string
  borderColorSuccess: string
  textColorSuccess: string
  backgroundWarning: string
  backgroundHoverWarning: string
  borderColorWarning: string
  textColorWarning: string
  backgroundDanger: string
  backgroundHoverDanger: string
  borderColorDanger: string
  textColorDanger: string
}

// 字段白名单只包含数据，不依赖组件实现或解析器。
export const buttonThemeKeys = [
  'background',
  'backgroundHover',
  'borderColor',
  'textColor',
  'borderRadius',
  'gap',
  'duration',
  'spinDuration',
  'disabledOpacity',
  'fontWeight',
  'heightSmall',
  'paddingSmall',
  'fontSizeSmall',
  'heightMedium',
  'paddingMedium',
  'fontSizeMedium',
  'heightLarge',
  'paddingLarge',
  'fontSizeLarge',
  'backgroundPrimary',
  'backgroundHoverPrimary',
  'borderColorPrimary',
  'textColorPrimary',
  'backgroundSuccess',
  'backgroundHoverSuccess',
  'borderColorSuccess',
  'textColorSuccess',
  'backgroundWarning',
  'backgroundHoverWarning',
  'borderColorWarning',
  'textColorWarning',
  'backgroundDanger',
  'backgroundHoverDanger',
  'borderColorDanger',
  'textColorDanger',
] as const satisfies readonly (keyof ButtonThemeTokens)[]
