// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/neuroflame-comp-notes-gen/', // ✅ Must match your GitHub repo name
  plugins: [react()],
})