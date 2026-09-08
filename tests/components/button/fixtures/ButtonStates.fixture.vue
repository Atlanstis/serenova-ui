<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SIconAdd, SIconArrowRight, buttonVariants, buttonSizes } from '@/index'
const disabled = ref(false)
const loading = ref(false)
const count = ref(0)
</script>
<template>
  <button @click="disabled = !disabled">禁用切换</button>
  <button @click="loading = !loading">加载切换</button>
  <SButton data-testid="target" :disabled="disabled" :loading="loading" @click="count++">
    <template #icon><SIconAdd /></template>操作<template #suffixIcon><SIconArrowRight /></template>
  </SButton>
  <output>{{ count }}</output>
  <div v-for="variant in buttonVariants" :key="variant">
    <SButton :data-testid="variant" :variant="variant">继续</SButton>
    <SButton :data-testid="variant + '-disabled'" :variant="variant" disabled>继续</SButton>
    <SButton :data-testid="variant + '-ghost'" :variant="variant" ghost>继续</SButton>
    <SButton :data-testid="variant + '-ghost-loading'" :variant="variant" ghost loading
      >继续</SButton
    >
  </div>
  <SButton
    v-for="size in buttonSizes"
    :key="size"
    :data-testid="size + '-icon'"
    :size="size"
    icon-only
    block
  >
    <template #icon><SIconAdd /></template>
  </SButton>
</template>
