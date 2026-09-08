import ThemeProvider from './src/ThemeProvider.vue'
import { withInstall } from '../../shared/with-install'

export const SThemeProvider = /* @__PURE__ */ withInstall(ThemeProvider, 'SThemeProvider')
export type {
  ThemeTokens,
  ButtonThemeTokens,
  ThemeOverrides,
  ThemePreset,
  ThemeProviderProps,
} from '../../theme/types'
