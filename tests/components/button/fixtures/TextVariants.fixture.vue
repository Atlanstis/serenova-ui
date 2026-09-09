<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SIconEdit, SThemeProvider, buttonVariants } from '@/index'
import type { ThemeOverrides } from '@/index'
defineProps<{ tokens?: ThemeOverrides }>()
const text = ref(true)
const loading = ref(false)
const count = ref(0)
</script>
<template>
  <SThemeProvider :tokens="tokens">
    <div v-for="variant in buttonVariants" :key="variant">
      <SButton
        :variant="variant"
        :text="text"
        ghost
        :loading="loading"
        :data-testid="variant"
        @click="count++"
      >
        <template #icon><SIconEdit /></template><span>操作</span>
      </SButton>
      <SButton :variant="variant" text disabled :data-testid="`${variant}-disabled`">操作</SButton>
    </div>
    <button @click="text = !text">切换文字</button>
    <button @click="loading = !loading">切换加载</button>
    <output>{{ count }}</output>
  </SThemeProvider>
</template>
