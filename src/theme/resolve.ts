import { lightPreset } from './presets/light'
import { buttonThemeKeys } from '../components/button/theme/types'
import type { ButtonThemeTokens, ThemeOverrides, ThemePreset } from './types'

export function mergeKnown<T extends object>(base: T, override: Partial<T> | undefined): T {
  const result = { ...base }
  for (const key of Object.keys(base) as (keyof T)[]) {
    if (override?.[key] !== undefined) result[key] = override[key]
  }
  return result
}

export function resolveTheme(base: ThemePreset, tokens?: ThemeOverrides): ThemePreset {
  const Button: Partial<ButtonThemeTokens> = {}
  for (const key of buttonThemeKeys) {
    const value = tokens?.components?.Button?.[key] ?? base.components?.Button?.[key]
    if (value !== undefined) Button[key] = value
  }
  return {
    name: base.name,
    common: mergeKnown(mergeKnown(lightPreset.common, base.common), tokens?.common),
    components: { Button },
  }
}
