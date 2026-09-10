<script setup lang="ts">
import { SButton, buttonVariants } from 'serenova-ui'
const labels = { primary: '主按钮', warning: '警告', success: '成功', error: '错误' }
defineOptions({ name: 'ButtonAppearanceExample' })
</script>

<template>
  <div class="matrix">
    <table>
      <thead>
        <tr>
          <th>类型</th>
          <th>默认</th>
          <th>Ghost</th>
          <th>文字</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="variant in buttonVariants" :key="variant">
          <th>{{ labels[variant] }} · {{ variant }}</th>
          <td><SButton :variant="variant">继续</SButton></td>
          <td><SButton :variant="variant" ghost>继续</SButton></td>
          <td><SButton :variant="variant" text>继续</SButton></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.matrix {
  overflow-x: auto;
  padding: 8px;
}
table {
  border-collapse: collapse;
  text-align: start;
}
th,
td {
  padding: 12px 16px;
  white-space: nowrap;
}
th {
  font-weight: 500;
}
</style>
