import type { Ref, InjectionKey } from 'vue'
import type { ThemePreset } from './types'

export const themeKey: InjectionKey<Readonly<Ref<Readonly<ThemePreset>>>> = Symbol('serenova-theme')
