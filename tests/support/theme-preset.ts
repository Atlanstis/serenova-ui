import { lightPreset } from '@/theme/presets/light'
import type { ThemePreset } from '@/theme/types'
export const customPreset: ThemePreset = Object.freeze({
  name: 'custom-light',
  common: Object.freeze({ ...lightPreset.common, colorPrimary: '#84adff' }),
})
