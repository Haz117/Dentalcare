import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { generateSitemap, generateRobotsTxt } from './src/hooks/useSEO';
import fs from 'fs';
import path from 'path';

// Plugin personalizado para generar sitemap y robots.txt
const seoPlugin = () => {
  return {
    name: 'seo-generator',
    generateBundle() {
      // Generar sitemap.xml
      const sitemap = generateSitemap();
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemap
      });

      // Generar robots.txt
      const robotsTxt = generateRobotsTxt();
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxt
      });
    }
  };
};

// Plugin para PWA manifest
const pwaManifestPlugin = () => {
  return {
    name: 'pwa-manifest',
    generateBundle() {
      // El manifest.json ya está en public/, pero podemos validarlo aquí
      const manifestPath = path.resolve(__dirname, 'public', 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        console.log('✅ PWA Manifest encontrado');
      }
    }
  };
};

// Plugin para optimizar imágenes (placeholder)
const imageOptimizationPlugin = () => {
  return {
    name: 'image-optimization',
    generateBundle() {
      console.log('🖼️ Optimización de imágenes habilitada');
      // Aquí se pueden agregar optimizaciones de imágenes
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    seoPlugin(),
    pwaManifestPlugin(),
    imageOptimizationPlugin()
  ],
  
  // Optimizaciones de build
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/messaging'],
          ui: ['lucide-react', 'date-fns']
        },
        
        // Naming strategy para archivos
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name].[hash].[ext]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name].[hash].[ext]`;
          }
          return `assets/[name].[hash].[ext]`;
        }
      }
    },
    
    // Configuración de Terser para mejor minificación
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.log en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: true,
      format: {
        comments: false
      }
    }
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: true,
    open: true
  },
  
  // Preview server config
  preview: {
    port: 4173,
    host: true
  },
  
  // Optimizaciones
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/messaging'
    ]
  },
  
  // Variables de entorno
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `$injected-color: orange;`
      }
    }
  }
});