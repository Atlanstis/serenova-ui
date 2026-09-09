<script setup lang="ts">
import { shallowRef } from 'vue'
import { lightPreset } from 'serenova-ui/themes/light'
const custom = shallowRef(false)

defineOptions({ name: 'ConsumerApp' })

const name = shallowRef('')
const confirmation = shallowRef('')
const loading = shallowRef(false)
const pendingName = shallowRef('')

function handleSubmit() {
  if (loading.value) return
  loading.value = true
  pendingName.value = name.value
}

function completeSubmit() {
  confirmation.value = `已提交：${pendingName.value}`
  loading.value = false
}
</script>

<template>
  <main>
    <h1>Serenova UI 消费应用</h1>

    <button @click="custom = !custom">切换主题</button>
    <SThemeProvider
      :preset="lightPreset"
      :tokens="custom ? { common: { colorPrimary: '#84adff' } } : {}"
    >
      <form @submit.prevent="handleSubmit">
        <label for="name">名称</label>
        <input id="name" v-model="name" name="name" required />
        <SButton type="submit" variant="primary" :loading="loading"
          ><template #icon><SIconAdd /></template>提交</SButton
        >
      </form>
    </SThemeProvider>

    <button v-if="loading" @click="completeSubmit">完成请求</button>
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
