import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "jsm-q1",
    project: "javascript-react"
  })],

  server: {
    hmr: {
      overlay: false
    }},

  build: {
    sourcemap: true
  }
})