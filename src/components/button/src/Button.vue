<script setup lang="ts">
import { computed } from 'vue'
import { useButtonTheme } from '../theme/use-button-theme'

import type { ButtonEmits, ButtonProps, ButtonSlots } from './public-types'

defineOptions({
  name: 'SButton',
})

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'medium',
  block: false,
  disabled: false,
  loading: false,
  nativeType: 'button',
})

const cssVars = useButtonTheme(props)

const emit = defineEmits<ButtonEmits>()

defineSlots<ButtonSlots>()

const isDisabled = computed(() => props.disabled || props.loading)

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }

  emit('click', event)
}
</script>

<template>
  <button
    class="s-button"
    :style="cssVars"
    :class="[
      `s-button--${variant}`,
      `s-button--${size}`,
      {
        's-button--block': block,
        's-button--loading': loading,
      },
    ]"
    :type="nativeType"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <span v-if="loading" class="s-button__spinner" />
    <span v-else-if="$slots.icon" class="s-button__icon">
      <slot name="icon" />
    </span>
    <span v-if="$slots.default" class="s-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.s-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: var(--s-button-gap);
  max-width: 100%;
  min-height: var(--s-button-height);
  padding: 0 var(--s-button-padding);
  margin: 0;
  border: 1px solid var(--s-button-border-color);
  border-radius: var(--s-button-border-radius);
  background: var(--s-button-background);
  color: var(--s-button-text-color);
  font: inherit;
  font-size: var(--s-button-font-size);
  font-weight: var(--s-button-font-weight);
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  transition:
    background-color var(--s-button-duration) ease,
    border-color var(--s-button-duration) ease,
    box-shadow var(--s-button-duration) ease,
    color var(--s-button-duration) ease,
    opacity var(--s-button-duration) ease;
}

.s-button:hover:not(:disabled) {
  background: var(--s-button-background-hover);
}

.s-button:active:not(:disabled) {
  transform: translateY(1px);
}

.s-button:disabled {
  cursor: not-allowed;
  opacity: var(--s-button-disabled-opacity);
}

.s-button--block {
  display: flex;
  width: 100%;
}

.s-button__icon,
.s-button__spinner {
  display: inline-flex;
  flex: 0 0 auto;
  width: 1em;
  height: 1em;
}

.s-button__spinner {
  border: 2px solid currentColor;
  border-inline-end-color: transparent;
  border-radius: 50%;
  animation: s-button-spin var(--s-button-spin-duration) linear infinite;
}

.s-button__content {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes s-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
