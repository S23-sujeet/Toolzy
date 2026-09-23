import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/** Writes ads.txt (required by Google AdSense to authorize this domain to sell ad inventory). */
function adsTxtPlugin(client: string | undefined): Plugin {
  return {
    name: 'ads-txt',
    apply: 'build',
    closeBundle() {
      if (!client) return
      const outDir = resolve(import.meta.dirname, 'dist')
      writeFileSync(resolve(outDir, 'ads.txt'), `google.com, ${client}, DIRECT, f08c47fec0942fa0\n`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')
  return {
    plugins: [react(), tailwindcss(), adsTxtPlugin(env.VITE_ADSENSE_CLIENT)],
    base: './',
  }
})
