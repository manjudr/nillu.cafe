import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SITE, STRUCTURED_DATA } from './src/data/site.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: 'search-metadata',
    transformIndexHtml() {
      return [
        { tag: 'title', children: SITE.title, injectTo: 'head' },
        ...[
          { name: 'description', content: SITE.description },
          { property: 'og:title', content: SITE.title },
          { property: 'og:description', content: SITE.description },
          { property: 'og:site_name', content: SITE.name },
          { property: 'og:image', content: SITE.image },
          { property: 'og:image:alt', content: SITE.imageAlt },
          { name: 'twitter:title', content: SITE.title },
          { name: 'twitter:description', content: SITE.description },
          { name: 'twitter:image', content: SITE.image },
          { name: 'twitter:image:alt', content: SITE.imageAlt },
        ].map(attrs => ({ tag: 'meta', attrs, injectTo: 'head' as const })),
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(STRUCTURED_DATA).replace(/</g, '\\u003c'), injectTo: 'head' },
      ]
    },
  }],
  build: { target: 'es2022', assetsInlineLimit: 1024, manifest: true },
})
