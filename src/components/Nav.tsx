import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import logo from '../assets/logo-ink.png'

const LINKS = [
  { href: '#word', label: 'The word' },
  { href: '#make', label: 'What we make' },
  { href: '#room', label: 'The room' },
  { href: '#find', label: 'Find us' },
]

export default function Nav() {
  const [lifted, setLifted] = useState(false)

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        lifted ? 'border-b border-line bg-paper/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-[6vw] py-4 sm:py-5">
        <a href="#top" aria-label="Nillu Café, back to top" className="shrink-0">
          <img src={logo} alt="Nillu Café" className="h-8 w-auto sm:h-10" />
        </a>

        <ul className="hidden items-center gap-8 md:flex lg:gap-11">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="eyebrow text-ink-soft transition-colors duration-300 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <span className="eyebrow hidden text-ink-faint sm:block">HSR Layout · Bengaluru</span>
      </nav>

      {/* Phones get the same links on a second line rather than behind a menu —
          four items do not earn a hamburger. */}
      <ul className="flex items-center justify-between gap-4 px-[6vw] pb-3 md:hidden">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="eyebrow text-ink-soft">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.header>
  )
}
