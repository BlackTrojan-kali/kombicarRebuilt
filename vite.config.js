import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),    tailwindcss(),],
  server: {
    host: '0.0.0.0', // Indiquez à l'application d'écouter sur toutes les interfaces
    port: 5173,
    allowedHosts: [ // Ajoutez cette ligne
      'kombicar.app'],
},
})
