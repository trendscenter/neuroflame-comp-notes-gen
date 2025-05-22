import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/computation-notes-app/', // 👈 Add this line
  plugins: [react()],
})