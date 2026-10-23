import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import postcss from 'postcss'

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx')
  const markup = await render()
  // SSR resolves imported artwork to source URLs. Use the production manifest
  // so the static HTML and hydrated client reference the same fingerprinted files.
  const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))
  let html = await readFile('dist/index.html', 'utf8')
  // Generate the first-screen CSS from the production stylesheet. Keep global
  // resets/theme/fonts and header/hero rules, including their responsive parents.
  // The full stylesheet then loads without blocking the initial text.
  const firstScreen = /\.(?:site-header|site-menu|brand-|returning-header|header-|nav-pill|skip-link|sr-only|walk-|page-reveal|scene-fallback)/
  for (const match of html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"<>]+\.css)"[^>]*>/g)) {
    const tree = postcss.parse(await readFile(`dist${match[1]}`, 'utf8'))
    function keep(node) {
      if (node.type === 'comment') return false
      if (node.type === 'rule' && !firstScreen.test(node.selector) && node.selector.includes('.')) return false
      if (node.type === 'atrule' && node.name === 'keyframes' && !node.params.startsWith('walk-')) return false
      if (node.nodes) {
        node.nodes.filter(child => !keep(child)).forEach(child => child.remove())
        return node.nodes.length > 0
      }
      return true
    }
    tree.nodes.filter(node => !keep(node)).forEach(node => node.remove())
    const critical = tree.toString().replace(/<\/style/gi, '<\\/style')
    const link = `<style>${critical}</style><link rel="stylesheet" href="${match[1]}" media="print" onload="this.media='all'"/><noscript><link rel="stylesheet" href="${match[1]}"/></noscript>`
    html = html.replace(match[0], link)
    console.log(`First-screen CSS: ${critical.length.toLocaleString()} characters.`)
  }
  const productionMarkup = markup.replace(/\/src\/assets\/[^"\s<>]+/g, path => {
    const asset = manifest[path.slice(1)]
    if (!asset) throw new Error(`Missing production asset: ${path}`)
    return `/${asset.file}`
  })
  if (!productionMarkup.includes('id="visit"') || !productionMarkup.includes('id="dessert-preview"')) {
    throw new Error('Prerender did not include all main-page sections')
  }
  await writeFile('dist/index.html', html.replace('<div id="root"></div>', `<div id="root">${productionMarkup}</div>`))
  console.log(`Prerendered home page (${productionMarkup.length.toLocaleString()} characters).`)
} finally {
  await server.close()
}
