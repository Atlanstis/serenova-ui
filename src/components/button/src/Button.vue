<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useButtonTheme } from '../theme/use-button-theme'
import LoadingIcon from '../../icon/src/generated/SIconLoading.vue'
import type { ButtonEmits, ButtonProps, ButtonSlots } from './public-types'

defineOptions({ name: 'SButton' })
const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  text: false,
  ghost: false,
  iconOnly: false,
})
const cssVars = useButtonTheme(props)
const emit = defineEmits<ButtonEmits>()
defineSlots<ButtonSlots>()
const isDisabled = computed(() => props.disabled || props.loading)
const isText = computed(() => props.text)
const isGhost = computed(() => props.ghost && !isText.value)
const canWave = computed(() => !isDisabled.value && !isText.value)
const wave = ref(0)
let sequence = 0
watch(
  canWave,
  (enabled) => {
    if (!enabled) wave.value = 0
  },
  { flush: 'sync' },
)
function handleClick(event: MouseEvent) {
  // 防御通过 dispatchEvent 程序触发的禁用点击；可用按钮不拦截原生行为。
  if (isDisabled.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  if (canWave.value) wave.value = ++sequence
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
        's-button--loading': loading,
        's-button--ghost': isGhost,
        's-button--text': isText,
        's-button--icon-only': iconOnly,
      },
    ]"
    type="button"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <span v-if="loading" class="s-button__spinner"><LoadingIcon :size="16" /></span>
    <span v-else-if="$slots.icon" class="s-button__icon"><slot name="icon" /></span>
    <span v-if="!iconOnly && $slots.default" class="s-button__content"><slot /></span>
    <span v-if="!iconOnly && !loading && $slots.suffixIcon" class="s-button__icon"
      ><slot name="suffixIcon"
    /></span>
    <span v-if="wave" :key="wave" class="s-button__wave" @animationend="wave = 0" />
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
  min-width: var(--s-button-min-width);
  height: var(--s-button-height);
  /* Figma 的内描边不参与布局，水平留白需包含这里的 1px 边框。 */
  padding: 0 max(0px, calc(var(--s-button-padding) - 1px));
  margin: 0;
  border: 1px solid var(--s-button-border-color);
  border-radius: var(--s-button-border-radius);
  background: var(--s-button-background);
  color: var(--s-button-text-color);
  box-shadow: var(--s-button-shadow);
  font-family: var(--s-button-font-family);
  font-size: var(--s-button-font-size);
  font-weight: var(--s-button-font-weight);
  line-height: var(--s-button-line-height);
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  transition:
    background-color var(--s-button-duration) ease,
    color var(--s-button-duration) ease;
}
.s-button:hover:not(:disabled) {
  background: var(--s-button-background-hover);
  color: var(--s-button-text-color-hover);
}
.s-button:active:not(:disabled) {
  background: var(--s-button-background-pressed);
  color: var(--s-button-text-color-pressed);
}
.s-button:focus-visible {
  outline: var(--s-button-focus-width) solid var(--s-button-focus-color);
  outline-offset: var(--s-button-focus-offset);
}
.s-button--text {
  /* 文字操作按内容排列，透明边框也不应产生额外水平留白。 */
  border-width: 0;
}
.s-button--text:not(.s-button--icon-only):focus-visible {
  /* 文字外观的焦点环围绕内容绘制，不沿用按钮的整档高度。 */
  outline: none;
}
.s-button--text:not(.s-button--icon-only):focus-visible::after {
  content: '';
  position: absolute;
  pointer-events: none;
  box-sizing: border-box;
  left: calc(-4px - var(--s-button-focus-width));
  top: 50%;
  width: calc(100% + 8px + 2 * var(--s-button-focus-width));
  height: calc(
    max(var(--s-button-line-height), var(--s-button-icon-size)) + 8px + 2 *
      var(--s-button-focus-width)
  );
  transform: translateY(-50%);
  border: var(--s-button-focus-width) solid var(--s-button-focus-color);
  border-radius: calc(var(--s-button-border-radius) + 3px);
}
.s-button--text:hover:not(:disabled) .s-button__content,
.s-button--text:active:not(:disabled) .s-button__content {
  text-decoration: underline;
}
.s-button:disabled {
  cursor: not-allowed;
  opacity: var(--s-button-disabled-opacity);
}
.s-button--icon-only {
  width: var(--s-button-height);
  flex: 0 0 auto;
}
.s-button__icon,
.s-button__spinner {
  display: inline-flex;
  flex: 0 0 auto;
  width: var(--s-button-icon-size);
  height: var(--s-button-icon-size);
}
.s-button__icon :deep(svg),
.s-button__spinner :deep(svg) {
  width: 100%;
  height: 100%;
}
.s-button__spinner {
  animation: s-button-spin var(--s-button-spin-duration) linear infinite;
}
.s-button__content {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.s-button__wave {
  position: absolute;
  inset: -1px;
  pointer-events: none;
  border-radius: inherit;
  animation: s-button-wave var(--s-button-wave-duration) ease-out forwards;
}
@keyframes s-button-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes s-button-wave {
  from {
    box-shadow: 0 0 0 0 var(--s-button-wave-color);
    opacity: 0.6;
  }
  to {
    box-shadow: 0 0 0 var(--s-button-wave-spread) var(--s-button-wave-color);
    opacity: 0;
  }
}
</style>
