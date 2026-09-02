<script setup lang="ts">
import { computed } from 'vue'

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
  --s-button-background: var(--s-color-surface-raised);
  --s-button-background-hover: var(--s-color-surface-hover);
  --s-button-border-color: var(--s-color-border-strong);
  --s-button-text-color: var(--s-color-text);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: var(--s-space-2);
  max-width: 100%;
  margin: 0;
  border: 1px solid var(--s-button-border-color);
  border-radius: var(--s-radius-medium);
  background: var(--s-button-background);
  color: var(--s-button-text-color);
  font: inherit;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  transition:
    background-color var(--s-duration-fast) ease,
    border-color var(--s-duration-fast) ease,
    box-shadow var(--s-duration-fast) ease,
    color var(--s-duration-fast) ease,
    opacity var(--s-duration-fast) ease;
}

.s-button:hover:not(:disabled) {
  background: var(--s-button-background-hover);
}

.s-button:active:not(:disabled) {
  transform: translateY(1px);
}

.s-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.s-button--primary {
  --s-button-background: var(--s-color-primary);
  --s-button-background-hover: var(--s-color-primary-hover);
  --s-button-border-color: var(--s-color-primary);
  --s-button-text-color: var(--s-color-on-primary);
}

.s-button--success {
  --s-button-background: var(--s-color-success);
  --s-button-background-hover: var(--s-color-success-hover);
  --s-button-border-color: var(--s-color-success);
  --s-button-text-color: var(--s-color-on-success);
}

.s-button--warning {
  --s-button-background: var(--s-color-warning);
  --s-button-background-hover: var(--s-color-warning-hover);
  --s-button-border-color: var(--s-color-warning);
  --s-button-text-color: var(--s-color-on-warning);
}

.s-button--danger {
  --s-button-background: var(--s-color-danger);
  --s-button-background-hover: var(--s-color-danger-hover);
  --s-button-border-color: var(--s-color-danger);
  --s-button-text-color: var(--s-color-on-danger);
}

.s-button--small {
  min-height: 30px;
  padding: 0 var(--s-space-3);
  font-size: 13px;
}

.s-button--medium {
  min-height: 38px;
  padding: 0 var(--s-space-4);
  font-size: 14px;
}

.s-button--large {
  min-height: 46px;
  padding: 0 var(--s-space-5);
  font-size: 16px;
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
  animation: s-button-spin 0.7s linear infinite;
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
