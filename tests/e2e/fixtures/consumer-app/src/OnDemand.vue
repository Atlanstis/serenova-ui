<script setup lang="ts">
import { shallowRef } from 'vue'
import { SIconAdd, SIconArrowRight } from 'serenova-ui/icons'
import { SButton } from 'serenova-ui/button'
import { SThemeProvider } from 'serenova-ui/theme-provider'
import { lightPreset } from 'serenova-ui/themes/light'
import 'serenova-ui/button/style.css'

const custom = shallowRef(false)
const count = shallowRef(0)
const loading = shallowRef(false)
</script>

<template>
  <main>
    <SButton variant="primary" data-testid="standalone">独立按钮</SButton>
    <button @click="custom = !custom">切换主题</button>
    <button @click="loading = !loading">切换加载</button>
    <SThemeProvider
      :preset="lightPreset"
      :tokens="custom ? { common: { colorPrimary: '#84adff' } } : {}"
    >
      <SButton variant="primary" :loading="loading" @click="count++"
        ><template #icon><SIconAdd /></template>计数<template #suffixIcon
          ><SIconArrowRight /></template
      ></SButton>
    </SThemeProvider>
    <output>{{ count }}</output>
  </main>
</template>
