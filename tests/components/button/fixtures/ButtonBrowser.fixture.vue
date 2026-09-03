<script setup lang="ts">
import { shallowRef } from 'vue'

import Button from '@/button/src/Button.vue'

defineOptions({ name: 'ButtonBrowserFixture' })

const submits = shallowRef(0)
const resets = shallowRef(0)
</script>

<template>
  <div>
    <Button data-testid="disabled-target" disabled>禁用按钮</Button>
    <Button data-testid="loading-target" loading>加载按钮</Button>
    <Button data-testid="primary-target" variant="primary">主要按钮</Button>
    <Button data-testid="small-target" size="small">小型按钮</Button>
    <Button data-testid="medium-target" size="medium">中型按钮</Button>
    <Button data-testid="large-target" size="large">大型按钮</Button>

    <div data-testid="block-container" style="width: 320px">
      <Button data-testid="block-target" block>块级按钮</Button>
    </div>

    <form @submit.prevent="submits += 1" @reset="resets += 1">
      <label>
        名称
        <input name="name" value="Serenova" />
      </label>
      <Button data-testid="submit-target" native-type="submit">提交表单</Button>
      <Button data-testid="reset-target" native-type="reset">重置表单</Button>
    </form>
    <output data-testid="submit-count">{{ submits }}</output>
    <output data-testid="reset-count">{{ resets }}</output>
  </div>
</template>
