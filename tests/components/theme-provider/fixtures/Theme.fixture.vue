<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { SButton, SThemeProvider } from '@/index'
import type { ThemeOverrides } from '@/components/theme-provider'
import { customPreset } from '../../../support/theme-preset'
import { lightPreset } from '@/theme/presets/light'

defineOptions({ name: 'ThemeIntegrationFixture' })

const custom = shallowRef(true)
const overrides = ref<ThemeOverrides>({
  common: { colorPrimary: '#123456' },
  components: { Button: { borderRadius: '20px' } },
})
const count = shallowRef(0)
</script>

<template>
  <button @click="custom = !custom">切换主题</button>
  <button @click="overrides = {}">移除覆盖</button>
  <SButton data-testid="plain" variant="primary">默认</SButton>
  <SThemeProvider :preset="custom ? customPreset : lightPreset" :tokens="overrides">
    <SButton data-testid="parent" variant="primary" @click="count++">操作</SButton>
    <SThemeProvider :tokens="{ common: { colorPrimary: '#654321' } }">
      <SButton data-testid="child" variant="primary">局部</SButton>
    </SThemeProvider>
    <SThemeProvider :inherit="false">
      <SButton data-testid="reset" variant="primary">重置</SButton>
    </SThemeProvider>
    <SThemeProvider :preset="lightPreset">
      <SButton data-testid="preset-reset" variant="primary">预设重置</SButton>
    </SThemeProvider>
    <Teleport to="body">
      <SButton data-testid="teleported" variant="primary">传送</SButton>
    </Teleport>
    <input aria-label="保留输入" />
  </SThemeProvider>
  <SThemeProvider :preset="customPreset">
    <SButton data-testid="sibling" variant="primary">兄弟</SButton>
  </SThemeProvider>
  <output data-testid="count">{{ count }}</output>
</template>
