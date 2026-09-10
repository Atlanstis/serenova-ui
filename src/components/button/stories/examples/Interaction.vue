<script setup lang="ts">
import { shallowRef } from 'vue'
import { SButton, type ButtonProps } from 'serenova-ui'
const props = withDefaults(defineProps<Omit<ButtonProps, 'iconOnly'>>(), {
  variant: 'primary',
  size: 'medium',
  text: false,
  ghost: false,
  disabled: false,
  loading: false,
})
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const clickCount = shallowRef(0)
function handleClick(event: MouseEvent) {
  clickCount.value += 1
  emit('click', event)
}
defineOptions({ name: 'ButtonInteractionExample' })
</script>

<template>
  <div class="row">
    <SButton v-bind="props" data-testid="interaction-button" @click="handleClick">保存更改</SButton
    ><span
      >点击次数：<output data-testid="click-count">{{ clickCount }}</output></span
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
