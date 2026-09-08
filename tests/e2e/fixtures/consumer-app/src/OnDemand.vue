<script setup lang="ts">
import { shallowRef } from 'vue'
import { SButton } from 'serenova-ui/button'
import { SThemeProvider } from 'serenova-ui/theme-provider'
import { darkPreset } from 'serenova-ui/themes/dark'
import { lightPreset } from 'serenova-ui/themes/light'
import 'serenova-ui/button/style.css'

const dark = shallowRef(false)
const count = shallowRef(0)
const loading = shallowRef(false)
</script>

<template>
  <main>
    <SButton variant="primary" data-testid="standalone">独立按钮</SButton>
    <button @click="dark = !dark">切换主题</button>
    <button @click="loading = !loading">切换加载</button>
    <SThemeProvider :preset="dark ? darkPreset : lightPreset">
      <SButton variant="primary" :loading="loading" @click="count++">计数</SButton>
    </SThemeProvider>
    <output>{{ count }}</output>
  </main>
</template>
