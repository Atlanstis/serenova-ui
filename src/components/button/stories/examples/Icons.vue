<script setup lang="ts">
import { SButton, SIconAdd, SIconArrowRight } from 'serenova-ui'
defineOptions({ name: 'ButtonIconsExample' })
</script>

<template>
  <div class="examples">
    <div class="row">
      <SButton
        ><template #icon><SIconAdd /></template>新增</SButton
      >
      <SButton
        >继续<template #suffixIcon><SIconArrowRight /></template
      ></SButton>
      <SButton
        ><template #icon><SIconAdd /></template>新增<template #suffixIcon
          ><SIconArrowRight /></template
      ></SButton>
    </div>
    <div class="row">
      <SButton loading
        ><template #icon><SIconAdd /></template>新增<template #suffixIcon
          ><SIconArrowRight /></template></SButton
      ><span>加载图标替代前置图标，后置图标暂时隐藏</span>
    </div>
  </div>
</template>

<style scoped>
.examples {
  display: grid;
  gap: 24px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
</style>
