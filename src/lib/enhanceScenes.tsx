import { Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

export async function enhanceExperience(element: HTMLElement) {
  const { default: Experience } = await import('../components/Experience')
  hydrateRoot(element, <Suspense fallback={<div className="experience-loading">Loading…</div>}><Experience /></Suspense>)
}

export async function enhanceStoryWord(element: HTMLElement) {
  const { default: LiquidHero } = await import('../components/LiquidHero')
  const root = createRoot(element)
  let active = true
  const render = () => root.render(<LiquidHero story active={active} />)
  render()
  new IntersectionObserver(([entry]) => { active = entry.isIntersecting; render() }).observe(element)
}
