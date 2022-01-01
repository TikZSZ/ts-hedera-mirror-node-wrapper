import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    testTimeout: Infinity,
    // threads: false,
    coverage: {
      reporter: ['text', 'html'],
    },
  },
})