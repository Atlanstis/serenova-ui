<script setup lang="ts">
import { SButton, SIconAdd } from 'serenova-ui'
defineOptions({ name: 'ButtonIconOnlyExample' })
</script>

<template>
  <div class="examples">
    <div class="row">
      <SButton size="small" icon-only title="新增（小）"
        ><template #icon><SIconAdd /></template
      ></SButton>
      <SButton size="medium" icon-only title="新增（中）"
        ><template #icon><SIconAdd /></template
      ></SButton>
      <SButton size="large" icon-only title="新增（大）"
        ><template #icon><SIconAdd /></template
      ></SButton>
    </div>
    <div class="row">
      <SButton ghost icon-only title="新增（Ghost）"
        ><template #icon><SIconAdd /></template
      ></SButton>
      <SButton disabled icon-only title="新增（禁用）"
        ><template #icon><SIconAdd /></template
      ></SButton>
      <SButton loading icon-only title="正在新增" />
      <SButton ghost loading icon-only title="正在新增（Ghost）" />
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
