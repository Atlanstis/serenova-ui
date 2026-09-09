<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SIconEdit, buttonSizes } from '@/index'

const count = ref(0)
</script>

<template>
  <div v-for="size in buttonSizes" :key="size" :data-testid="size" class="row">
    <SButton :size="size">保存</SButton>
    <SButton :size="size" variant="warning" ghost>暂存</SButton>
    <SButton :size="size" text @click="count++"><span>编辑</span></SButton>
    <SButton :size="size" text><span>查看详情</span></SButton>
    <SButton :size="size" text loading><span>加载中</span></SButton>
    <SButton :size="size" text disabled><span>删除</span></SButton>
    <SButton :size="size" text icon-only title="编辑图标">
      <template #icon><SIconEdit /></template>
    </SButton>
  </div>
  <output>{{ count }}</output>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
