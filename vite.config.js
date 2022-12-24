import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  server: {
    proxy: {
      '/audio': {
        target: 'http://localhost:9002',
        ws: true
      },
      '/waterfall': {
        target: 'http://localhost:9002',
        ws: true
      },
      '/events': {
        target: 'http://localhost:9002',
        ws: true
      },
      '/signal': {
        target: 'http://localhost:9002',
        ws: true
      }
    }
  },
  define: {
    __filename: JSON.stringify('')
  },
  build: {
    minify: false,
    rollupOptions: {
      output: {
      },
      plugins: [visualizer()]
    }
  }
})
