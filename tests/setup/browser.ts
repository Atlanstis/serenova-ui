import { afterEach } from 'vitest'
import { cleanup } from 'vitest-browser-vue'

afterEach(async () => {
  await cleanup()
})
