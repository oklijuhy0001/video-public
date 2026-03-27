import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Ensure main entry is named predictably for htmlBuilder reference
        entryFileNames: 'assets/main.js',
      },
    },
  },
})
