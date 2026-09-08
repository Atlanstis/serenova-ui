<!-- 此文件由 scripts/generate-icons.mjs 生成，请修改原始资源后重新生成。 -->
<script setup lang="ts">
import { computed } from 'vue'
import type { IconProps } from '../public-types'
defineOptions({ name: 'SIconDelete' })
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
        d="M3 6H21M8 6V3H16V6M5 6L6 20H18L19 6M10 9V16M14 9V16"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>
