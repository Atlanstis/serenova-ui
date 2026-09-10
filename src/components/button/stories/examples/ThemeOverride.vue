<script setup lang="ts">
import { SButton, SThemeProvider } from 'serenova-ui'
defineOptions({ name: 'ButtonThemeOverrideExample' })
</script>

<template>
  <div class="row">
    <SButton>默认主色</SButton>
    <SThemeProvider
      :tokens="{
        common: {
          colorPrimary: '#2563eb',
          colorPrimaryHover: '#1d4ed8',
          colorPrimaryPressed: '#1e40af',
        },
      }"
      ><SButton>局部主色</SButton></SThemeProvider
    >
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
</style>
