import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export function useNearViewport(ref: RefObject<Element | null>, margin = '0px', once = false) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (!('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (entry.isIntersecting && once) observer.disconnect()
    }, { rootMargin: margin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, margin, once])
  return visible
}
