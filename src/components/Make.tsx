import Reveal from './Reveal'
import ProductPanel from './ProductPanel'
import { ITEMS } from '../data/menu'

export default function Make() {
  return (
    <section id="make" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-[1500px] px-[6vw] pt-[clamp(5rem,13vh,9rem)]">
        <Reveal>
          <p lang="kn" className="kn-sub text-ink-faint">
            ನಾವು ಮಾಡುವುದು
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="display-h2 mt-4">What we make</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-[44ch] text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-[1.7] text-ink-soft">
            Coffee, juice, bowls, small plates and the counter. The list is not fixed, so there
            is usually something in the room that has not made it onto this page.
          </p>
        </Reveal>
      </div>

      {ITEMS.map((item, i) => (
        <ProductPanel key={item.id} item={item} index={i} />
      ))}
    </section>
  )
}
