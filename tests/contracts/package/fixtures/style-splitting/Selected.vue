<script setup lang="ts">
defineOptions({ name: 'SelectedFixture' })
import { SButton } from '../../../../../src/components/button'
</script>
<template>
  <div class="fixture-shared"><SButton>依赖按钮</SButton></div>
</template>
<style scoped>
.fixture-shared {
  background-image: url('./marker.svg');
}
</style>
