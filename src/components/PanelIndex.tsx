import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ITEMS } from '../data/menu'

/**
 * A quiet marker down the right edge showing which panel you are looking
 * at. It only appears while you are inside "What we make" and is purely an
 * indicator — the real links live in the nav, so this is hidden from
 * assistive tech rather than duplicated there.
 */
export default function PanelIndex() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const panels = ITEMS.map((i) => document.getElementById(`panel-${i.id}`)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (panels.length === 0) return

    // A one-pixel band across the middle of the viewport: whichever panel
    // crosses it is the one being read.
    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).id.replace('panel-', '')
          if (e.isIntersecting) visible.add(id)
          else visible.delete(id)
        }
        const first = ITEMS.find((i) => visible.has(i.id))
        setActive(first ? first.id : null)
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )

    panels.forEach((p) => io.observe(p))
    return () => io.disconnect()
  }, [])

  return (
    <motion.div
      aria-hidden
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="pointer-events-none fixed right-[2.5vw] top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex"
    >
      {ITEMS.map((item) => {
        const on = item.id === active
        return (
          <span key={item.id} className="flex items-center gap-3.5">
            <motion.span
              animate={{ opacity: on ? 1 : 0, x: on ? 0 : 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow whitespace-nowrap text-ink-faint"
            >
              {item.en}
            </motion.span>
            <motion.span
              animate={{ scale: on ? 1 : 0.4, opacity: on ? 1 : 0.25 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block size-1.5 rounded-full bg-ink"
            />
          </span>
        )
      })}
    </motion.div>
  )
}
