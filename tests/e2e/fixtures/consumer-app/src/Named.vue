<script setup lang="ts">
defineOptions({ name: 'NamedConsumer' })
import { SButton } from 'serenova-ui'
</script>

<template>
  <SButton>根入口按钮</SButton>
  <SButton style="--s-button-background: #123456">覆盖按钮</SButton>
</template>
