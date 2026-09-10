<script setup lang="ts">
import { SButton } from 'serenova-ui'
defineOptions({ name: 'ButtonTextExample' })
</script>

<template>
  <div class="examples">
    <div class="row">
      <SButton text>主按钮</SButton><SButton variant="warning" text>警告</SButton
      ><SButton variant="success" text>成功</SButton><SButton variant="error" text>错误</SButton>
    </div>
    <div class="row">
      <SButton text disabled>禁用</SButton><SButton text loading>加载中</SButton
      ><SButton text ghost>Text + Ghost</SButton>
    </div>
    <!-- 文字按钮按内容宽度排列，间距由容器负责。 -->
    <div class="row">
      <SButton>保存</SButton><SButton text>编辑</SButton><SButton text>查看详情</SButton
      ><SButton variant="error" text>删除</SButton>
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
