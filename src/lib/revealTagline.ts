/** Let the completed logo settle, then reveal the whole invitation once. */
export function revealTagline(element: HTMLElement, visible: boolean, reduced: boolean) {
 element.querySelector('span')!.textContent = 'Stay a little.'
 element.classList.toggle('is-visible', visible)
 element.style.opacity = visible && reduced ? '1' : '0'
 if (!visible || reduced) return () => {}
 const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
  delay: 500, duration: 600, easing: 'ease-out', fill: 'both',
 })
 void animation.finished.then(() => {
  element.style.opacity = '1'
  animation.cancel()
 }, () => {})
 return () => animation.cancel()
}
