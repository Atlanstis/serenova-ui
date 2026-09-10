<script setup lang="ts">
import { computed } from 'vue'
import { SButton, SIconAdd, SIconArrowRight, type ButtonProps } from 'serenova-ui'
interface Props extends ButtonProps {
  label?: string
  icons?: 'none' | 'prefix' | 'suffix' | 'both'
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  text: false,
  ghost: false,
  iconOnly: false,
  disabled: false,
  loading: false,
  label: '保存更改',
  icons: 'none',
})
const emit = defineEmits<{ click: [event: MouseEvent] }>()
// 文案和图标选项属于示例，只有公共属性传给按钮。
const buttonProps = computed<ButtonProps>(() => ({
  variant: props.variant,
  size: props.size,
  text: props.text,
  ghost: props.ghost,
  iconOnly: props.iconOnly,
  disabled: props.disabled,
  loading: props.loading,
}))
const showPrefix = computed(
  () => props.iconOnly || props.icons === 'prefix' || props.icons === 'both',
)
const showSuffix = computed(
  () => !props.iconOnly && (props.icons === 'suffix' || props.icons === 'both'),
)
defineOptions({ name: 'ButtonPlaygroundExample' })
</script>

<template>
  <SButton
    v-bind="buttonProps"
    :title="props.iconOnly ? props.label : undefined"
    @click="emit('click', $event)"
  >
    <template v-if="showPrefix" #icon><SIconAdd /></template>
    {{ props.label }}
    <template v-if="showSuffix" #suffixIcon><SIconArrowRight /></template>
  </SButton>
</template>
