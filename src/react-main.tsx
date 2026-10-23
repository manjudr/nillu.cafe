import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = document.getElementById('root')!
const preview = new URLSearchParams(window.location.search).has('preview')
if (preview) {
  // Studies are alternate views of the home URL, not separate search pages.
  const robots = document.createElement('meta')
  robots.name = 'robots'
  robots.content = 'noindex, follow'
  document.head.append(robots)
}
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
createRoot(root).render(app)
