<!-- 此文件由 scripts/generate-icons.mjs 生成，请修改原始资源后重新生成。 -->
<script setup lang="ts">
import { computed } from 'vue'
import type { IconProps } from '../public-types'
defineOptions({ name: 'SIconEdit' })
const props = withDefaults(defineProps<IconProps>(), { size: 24 })
const dimension = computed(() => (typeof props.size === 'number' ? props.size + 'px' : props.size))
</script>
<template>
  <svg
    :width="dimension"
    :height="dimension"
    :style="{ color: props.color }"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M14 5.5L18 9.5M3 20.5H21M5 14.5L16 3.5C16.6667 2.83333 17.3333 2.83333 18 3.5L20 5.5C20.6667 6.16667 20.6667 6.83333 20 7.5L9 18.5L4 19.5L5 14.5Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>
