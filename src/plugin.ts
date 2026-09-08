import type { Plugin } from 'vue'
import { SButton } from './components/button'
import { SThemeProvider } from './components/theme-provider'

const components = [SButton, SThemeProvider] as const

export const SerenovaUI: Plugin = {
  install(app) {
    components.forEach((component) => app.use(component))
  },
}

export default SerenovaUI
