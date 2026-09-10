<script setup lang="ts">
import { onUnmounted, shallowRef } from 'vue'
import { SButton } from 'serenova-ui'
const loading = shallowRef(false)
const saved = shallowRef(false)
let timer: ReturnType<typeof setTimeout> | undefined
function save() {
  if (loading.value) return
  loading.value = true
  saved.value = false
  // 模拟保存完成；实际应用可在请求的 finally 中恢复 loading。
  timer = setTimeout(() => {
    loading.value = false
    saved.value = true
  }, 1200)
}
onUnmounted(() => clearTimeout(timer))
defineOptions({ name: 'ButtonDisabledAndLoadingExample' })
</script>

<template>
  <div class="examples">
    <div class="row">
      <SButton disabled>禁用</SButton><SButton loading>加载中</SButton
      ><SButton ghost loading>Ghost 加载</SButton>
    </div>
    <div class="row">
      <SButton :loading="loading" @click="save">保存更改</SButton
      ><span>{{
        loading ? '正在保存…' : saved ? '保存成功，可再次操作' : '点击体验加载与恢复'
      }}</span>
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
