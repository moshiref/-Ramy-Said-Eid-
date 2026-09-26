import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|react-router-dom)/ },
            { name: 'supabase', test: /node_modules[\\/]@supabase/ },
          ],
        },
      },
    },
  },
})
