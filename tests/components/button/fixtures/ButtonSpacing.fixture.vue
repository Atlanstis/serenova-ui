<script setup lang="ts">
import { SButton, SIconEdit, SIconArrowRight, SThemeProvider, buttonSizes } from '@/index'
import type { ButtonVariant, ThemeOverrides } from '@/index'

defineProps<{ variant?: ButtonVariant; text?: boolean; ghost?: boolean; tokens?: ThemeOverrides }>()

const layouts = ['text', 'prefix', 'suffix', 'both', 'loading'] as const
</script>

<template>
  <SThemeProvider :tokens="tokens">
    <div v-for="size in buttonSizes" :key="size">
      <SButton
        v-for="layout in layouts"
        :key="layout"
        :size="size"
        :variant="variant"
        :text="text"
        :ghost="ghost"
        :loading="layout === 'loading'"
        :data-testid="`${size}-${layout}`"
      >
        <template v-if="layout === 'prefix' || layout === 'both'" #icon>
          <SIconEdit data-testid="prefix" />
        </template>
        <span data-testid="label">编辑</span>
        <template v-if="layout === 'suffix' || layout === 'both'" #suffixIcon>
          <SIconArrowRight data-testid="suffix" />
        </template>
      </SButton>
    </div>
  </SThemeProvider>
</template>
