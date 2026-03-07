import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('@supabase')) return 'supabase'
            if (id.includes('react-router') || id.includes('@remix-run')) return 'router'
            if (id.includes('react-dom')) return 'react-vendor'
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) return 'forms'
            if (id.includes('@sentry')) return 'sentry'
          }
        },
      },
    },
  },
})
