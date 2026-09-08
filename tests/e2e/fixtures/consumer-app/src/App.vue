<script setup lang="ts">
import { shallowRef } from 'vue'
import { darkPreset } from 'serenova-ui/themes/dark'
import { lightPreset } from 'serenova-ui/themes/light'
const dark = shallowRef(false)

defineOptions({ name: 'ConsumerApp' })

const name = shallowRef('')
const confirmation = shallowRef('')

function handleSubmit() {
  confirmation.value = `已提交：${name.value}`
}
</script>

<template>
  <main>
    <h1>Serenova UI 消费应用</h1>

    <button @click="dark = !dark">切换主题</button>
    <SThemeProvider :preset="dark ? darkPreset : lightPreset">
      <form @submit.prevent="handleSubmit">
        <label for="name">名称</label>
        <input id="name" v-model="name" name="name" required />
        <SButton native-type="submit" variant="primary">提交</SButton>
      </form>
    </SThemeProvider>

    <output v-if="confirmation" data-testid="confirmation">{{ confirmation }}</output>
  </main>
</template>

<style scoped>
main {
  display: grid;
  gap: 16px;
  max-width: 480px;
  margin: 48px auto;
  color: #182230;
  font-family: sans-serif;
}

form {
  display: grid;
  gap: 12px;
}

input {
  min-height: 36px;
  border: 1px solid #98a2b3;
  border-radius: 8px;
}
</style>
