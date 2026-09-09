<script setup lang="ts">
import { shallowRef } from 'vue'
import Button from '@/components/button/src/Button.vue'

const props = defineProps<{
  initialType?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}>()
const attrs = shallowRef<{ type?: 'button' | 'submit' | 'reset' }>(
  props.initialType ? { type: props.initialType } : {},
)
const clicks = shallowRef(0)
const submits = shallowRef(0)
const resets = shallowRef(0)
</script>

<template>
  <div>
    <button type="button" @click="attrs = { type: 'submit' }">设置提交</button>
    <button type="button" @click="attrs = { type: 'reset' }">设置重置</button>
    <button type="button" @click="attrs = {}">移除类型</button>
    <form @submit.prevent="submits += 1" @reset="resets += 1">
      <label>名称<input name="name" value="Serenova" /></label>
      <Button
        v-bind="attrs"
        data-testid="form-target"
        :disabled="disabled"
        :loading="loading"
        @click="clicks += 1"
        >表单操作</Button
      >
      <button type="button">后续操作</button>
    </form>
    <output data-testid="clicks">{{ clicks }}</output>
    <output data-testid="submits">{{ submits }}</output>
    <output data-testid="resets">{{ resets }}</output>
  </div>
</template>
