<script setup lang="ts">
import { SButton } from 'serenova-ui'
defineOptions({ name: 'ButtonSizesExample' })
</script>

<template>
  <div class="row">
    <div>
      <SButton size="small">继续</SButton>
      <p>Small · 28 px</p>
    </div>
    <div>
      <SButton size="medium">继续</SButton>
      <p>Medium · 34 px</p>
    </div>
    <div>
      <SButton size="large">继续</SButton>
      <p>Large · 40 px</p>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
p {
  margin: 12px 0 0;
  font-size: 13px;
}
</style>
