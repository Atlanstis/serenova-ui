<script setup lang="ts">
import { SButton, SThemeProvider, buttonVariants } from '@/index'

const colors = {
  textColorText: '#123456',
  ghostColorPrimary: '#234567',
  ghostColorWarning: '#345678',
  ghostColorSuccess: '#456789',
  ghostColorError: '#56789a',
}
</script>

<template>
  <SThemeProvider :tokens="{ components: { Button: colors } }">
    <SButton v-for="variant in buttonVariants" :key="variant" :variant="variant" ghost>
      {{ variant }}
    </SButton>
  </SThemeProvider>
</template>
