// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',       // <- Asegúrate de esto
  plugins: [react()],
  resolve: {
    alias: {
      // Alias opcional: @ apunta a /src
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // ...
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
// Asegúrate de usar rutas absolutas (desde la raíz del proyecto) para que Sass las encuentre.
// Si tienes el alias "@", también podrías usar "@styles/..." en lugar de "/src/styles/...".
@use "/src/styles/tokens" as *;
@use "/src/styles/breakpoints" as *;
@use "/src/styles/mixins" as *;
`
      }
    }
  }
})
