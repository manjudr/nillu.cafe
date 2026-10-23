import { WALK_STORY } from '../data/walkStory'
import { startWalkPlayer } from './walkPlayer'

/** Progressive enhancement for the already-rendered page, without React startup. */
export function enhancePage() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const header = document.querySelector<HTMLElement>('.site-header')!
  const menu = header.querySelector<HTMLButtonElement>('.site-menu-toggle')!
  const nav = header.querySelector<HTMLElement>('nav')!
  let previous = 0, menuOpen = false
  const showHeader = () => { header.classList.add('header-visible'); header.classList.remove('header-hidden') }
  const setMenu = (open: boolean) => {
    menuOpen = open
    menu.setAttribute('aria-expanded', String(open))
    menu.firstChild!.textContent = open ? 'Close' : 'Menu'
    menu.querySelector('span')!.textContent = open ? '×' : '☰'
    nav.classList.toggle('nav-open', open)
    if (open) showHeader()
  }
  menu.addEventListener('click', () => setMenu(!menuOpen))
  header.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)))
  header.addEventListener('focusin', showHeader)
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuOpen) { setMenu(false); menu.focus() }
  })
  addEventListener('resize', () => { if (innerWidth > 640) setMenu(false) })
  addEventListener('scroll', () => {
    const y = Math.max(0, scrollY)
    if (Math.abs(y - previous) < 6) return
    const visible = menuOpen || y < 100 || y < previous
    header.classList.toggle('header-visible', visible)
    header.classList.toggle('header-hidden', !visible)
    header.classList.toggle('header-raised', y > 40)
    previous = y
  }, { passive: true })

  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      reveals.unobserve(entry.target)
    })
  }, { rootMargin: '0px 0px -8% 0px' })
  document.querySelectorAll('.page-reveal').forEach(element => reveals.observe(element))

  const canvas = document.querySelector<HTMLCanvasElement>('.walk-stage canvas')!
  const copy = document.querySelector<HTMLElement>('.walk-copy>div')!
  const title = document.getElementById('walk-title')!
  const caption = document.querySelector('.walk-support')!
  const kicker = document.querySelector('.walk-kicker')!
  let phase = 'walk'
  startWalkPlayer(canvas, reduced, next => {
    if (next === phase) return
    phase = next
    const current = WALK_STORY[next], accent = document.createElement('em')
    accent.textContent = current.accent
    title.replaceChildren(document.createTextNode(current.title), document.createElement('br'), accent)
    caption.textContent = current.copy; kicker.textContent = current.number
    if (!reduced.matches) copy.animate([{ transform: 'translateY(12px)' }, { transform: 'none' }], { duration: 450 })
  })

  const onceNear = (selector: string, margin: string, enhance: (element: HTMLElement) => Promise<void>) => {
    const element = document.querySelector<HTMLElement>(selector)
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      void enhance(element).catch(error => { document.documentElement.classList.add('graphics-failed'); console.error(error) })
    }, { rootMargin: margin })
    observer.observe(element)
  }
  onceNear('.experience-island', '400px', async element => {
    const { enhanceExperience } = await import('./enhanceScenes')
    await enhanceExperience(element)
  })
  onceNear('#story-word', '80px', async element => {
    if (reduced.matches) return
    const { enhanceStoryWord } = await import('./enhanceScenes')
    await enhanceStoryWord(element)
  })
  document.documentElement.dataset.pageReady = 'true'
}
