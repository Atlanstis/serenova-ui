<!-- 此文件由 scripts/generate-icons.mjs 生成，请修改原始资源后重新生成。 -->
<script setup lang="ts">
import { computed } from 'vue'
import type { IconProps } from '../public-types'
defineOptions({ name: 'SIconLoading' })
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
      <g>
        <path
          d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </g>
  </svg>
</template>
