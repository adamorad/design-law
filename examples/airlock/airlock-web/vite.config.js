import { defineConfig } from 'vite'
import { readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

// Multi-page: every .html under this folder is an entry, so a new page is a new file.
const root = import.meta.dirname
const skip = new Set(['node_modules', 'dist', 'public', 'src'])
const pages = {}
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) { if (!skip.has(name)) walk(p) }
    else if (name.endsWith('.html')) pages[p.slice(root.length + 1).replace(/\.html$/, '')] = resolve(p)
  }
}
walk(root)

export default defineConfig({ build: { rollupOptions: { input: pages } } })
