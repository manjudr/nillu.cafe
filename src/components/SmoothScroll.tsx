import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Lenis gives the page its weighted, slightly delayed scroll. It is bypassed
 * entirely for visitors who have asked for reduced motion, who then get the
 * browser's native scrolling.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  if (reduced) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 }}>
      {children}
    </ReactLenis>
  )
}
