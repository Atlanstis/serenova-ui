import type { ThemePreset } from '../types'
import { lightPreset } from './light'

export const darkPreset: ThemePreset = Object.freeze({
  name: 'dark',
  common: Object.freeze({
    ...lightPreset.common,
    colorPrimary: '#84adff',
    colorPrimaryHover: '#b2ccff',
    colorOnPrimary: '#102a56',
    colorSuccess: '#75e0a7',
    colorSuccessHover: '#a6f4c5',
    colorOnSuccess: '#053321',
    colorWarning: '#fec84b',
    colorWarningHover: '#fedf89',
    colorOnWarning: '#4e1d09',
    colorDanger: '#fda29b',
    colorDangerHover: '#fecdca',
    colorOnDanger: '#55160c',
    colorText: '#f9fafb',
    colorTextMuted: '#d0d5dd',
    colorSurface: '#101828',
    colorSurfaceRaised: '#1d2939',
    colorSurfaceHover: '#344054',
    colorBorder: '#344054',
    colorBorderStrong: '#667085',
  }),
})
export type { ThemePreset } from '../types'
