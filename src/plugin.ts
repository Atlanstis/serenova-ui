import type { Plugin } from 'vue'
import { SButton } from './components/button'
import { SThemeProvider } from './components/theme-provider'

import {
  SIconAdd,
  SIconDelete,
  SIconEdit,
  SIconSearch,
  SIconArrowRight,
  SIconLoading,
} from './components/icon'

const components = [
  SButton,
  SThemeProvider,
  SIconAdd,
  SIconDelete,
  SIconEdit,
  SIconSearch,
  SIconArrowRight,
  SIconLoading,
] as const

export const SerenovaUI: Plugin = {
  install(app) {
    components.forEach((component) => app.use(component))
  },
}

export default SerenovaUI
