import { Suspense, lazy } from 'react'
import { motion } from 'motion/react'
import StillWord from './StillWord'

// three.js is ~2/3 of the bundle. Keep it out of the first paint: the static
// lockup stands in until the WebGL chunk lands.
const LiquidHero = lazy(() => import('./LiquidHero'))

export default function Hero() {
  return (
    <section id="hero" className="relative h-[100svh] w-full overflow-hidden">
      <Suspense fallback={<StillWord />}>
        <LiquidHero />
      </Suspense>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-[clamp(1.75rem,5vh,3.5rem)]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="eyebrow text-ink-soft"
        >
          Kannada for “stop”
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2 }}
          className="mt-[clamp(1.25rem,3.5vh,2.25rem)] flex flex-col items-center gap-3"
        >
          <span className="eyebrow text-ink-faint">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 block h-1/2 bg-ink"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  )
}
