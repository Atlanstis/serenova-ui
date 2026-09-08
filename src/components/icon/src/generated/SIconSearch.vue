<!-- 此文件由 scripts/generate-icons.mjs 生成，请修改原始资源后重新生成。 -->
<script setup lang="ts">
import { computed } from 'vue'
import type { IconProps } from '../public-types'
defineOptions({ name: 'SIconSearch' })
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
        d="M13.5 13.5L20 20M15 9C15 12.314 12.314 15 9 15C5.686 15 3 12.314 3 9C3 5.686 5.686 3 9 3C12.314 3 15 5.686 15 9Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>
