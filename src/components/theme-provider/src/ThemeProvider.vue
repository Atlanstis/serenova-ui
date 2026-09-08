<script setup lang="ts">
import { computed, inject, provide, readonly } from 'vue'
import type { VNode } from 'vue'
import type { ThemeProviderProps } from '../../../theme/types'
import { themeKey } from '../../../theme/context'
import { resolveTheme } from '../../../theme/resolve'
import { lightPreset } from '../../../theme/presets/light'

defineOptions({ name: 'SThemeProvider', inheritAttrs: false })
const props = withDefaults(defineProps<ThemeProviderProps>(), { inherit: true })
defineSlots<{ default?: () => VNode[] }>()
const parent = inject(themeKey, undefined)
const theme = computed(() =>
  resolveTheme(
    props.preset ?? (props.inherit ? parent?.value : undefined) ?? lightPreset,
    props.tokens,
  ),
)
provide(themeKey, readonly(theme))
</script>

<template>
  <slot />
</template>
