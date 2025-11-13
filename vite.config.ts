import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Adicione a propriedade 'base' para corrigir caminhos absolutos
  base: '/',
  plugins: [react()],
})