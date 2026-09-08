<script setup lang="ts">
import { ref } from 'vue'
import * as icons from '@/components/icon'
defineOptions({ name: 'IconsIntegrationFixture' })
const changed = ref(false)
</script>
<template>
  <div style="color: rgb(12, 34, 56); font-size: 10px">
    <button @click="changed = !changed">切换图标</button>
    <component
      :is="icon"
      v-for="(icon, name) in icons"
      :key="name"
      :data-testid="name"
      :size="changed ? '2em' : 16"
      :color="changed ? '#654321' : undefined"
    />
    <icons.SIconAdd data-testid="duplicate" />
    <button>下一项</button>
  </div>
</template>
