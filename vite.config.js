import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: false // Desactivar overlay de errores que puede interferir
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar chunks para mejor carga
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          ui: ['lucide-react', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom', 
      'react-router-dom',
      'firebase/app',
      'firebase/firestore',
      'firebase/auth',
      'lucide-react',
      'date-fns'
    ]
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
