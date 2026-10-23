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
  let phase: keyof typeof WALK_STORY = 'walk'
  let copyTransition: Animation | undefined
  let transitionVersion = 0
  let copyPause: number | undefined
  const renderCopy = (next: keyof typeof WALK_STORY) => {
    title.classList.toggle('walk-title-sketch', next === 'walk' || next === 'nillu')
    const current = WALK_STORY[next], accent = document.createElement('em')
    accent.textContent = current.accent
    title.replaceChildren(document.createTextNode(current.title), document.createElement('br'), accent)
    caption.textContent = current.copy; kicker.textContent = current.number
  }
  startWalkPlayer(canvas, reduced, next => {
    if (next === phase) return
    phase = next
    const version = ++transitionVersion
    const opacity = getComputedStyle(copy).opacity
    // Preserve the current opacity before cancelling, so no full-opacity frame flashes.
    copy.style.opacity = opacity
    copyTransition?.cancel()
    window.clearTimeout(copyPause)
    if (reduced.matches) { copy.style.opacity = '1'; renderCopy(next); return }
    const outgoing = copy.animate([{ opacity }, { opacity: 0 }], {
      duration: 200, easing: 'ease-in', fill: 'forwards',
    })
    copyTransition = outgoing
    void outgoing.finished.then(() => {
      if (version !== transitionVersion) return
      copy.style.opacity = '0'
      outgoing.cancel()
      // Hold a clear frame between messages. Only one text block exists.
      copyPause = window.setTimeout(() => {
        if (version !== transitionVersion) return
        renderCopy(next)
        if (reduced.matches) { copy.style.opacity = '1'; return }
        const incoming = copy.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 700, easing: 'ease-in-out', fill: 'forwards',
        })
        copyTransition = incoming
        void incoming.finished.then(() => {
          if (version !== transitionVersion) return
          copy.style.opacity = '1'
          incoming.cancel()
          copyTransition = undefined
        }, () => {})
      }, 120)
    }, () => { /* A newer phase safely supersedes this transition. */ })
  })
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return
    ++transitionVersion
    window.clearTimeout(copyPause)
    copy.style.opacity = '1'
    copyTransition?.cancel()
    renderCopy(phase)
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
