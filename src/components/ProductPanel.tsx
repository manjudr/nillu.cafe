import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import type { Item } from '../data/menu'
import { imageFor } from '../lib/images'
import { useFinePointer } from '../lib/useFinePointer'

const SPRING = { stiffness: 130, damping: 18, mass: 0.7 }

/** Smooths the raw scroll fraction so the card glides rather than steps. */
const SCROLL_SPRING = { stiffness: 120, damping: 30, mass: 0.4 }

/** Each element of the copy column rises in turn rather than all at once. */
const RISE = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
}

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
}

export default function ProductPanel({ item, index }: { item: Item; index: number }) {
  const section = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const flipped = index % 2 === 1

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start end', 'end start'],
  })
  const p = useSpring(scrollYProgress, SCROLL_SPRING)

  // The subject is sticky through the panel, so instead of drifting it turns:
  // scroll position drives the rotation, which reads as the object being
  // examined while you work down the list beside it.
  const scrollTurn = useTransform(p, [0, 1], reduced ? [0, 0] : [-11, 11])

  // The card opens as it arrives, settles at full size while you read, then
  // eases back as it leaves. This is the move that gives the section its
  // sense of depth — everything else is in service of it.
  const cardScale = useTransform(p, [0, 0.5, 1], reduced ? [1, 1, 1] : [0.88, 1, 0.94])

  // The frame holds still and the picture travels inside it, so the crop
  // keeps changing while you read. This is the move the whole section is
  // built around — see the safe-area note in src/assets/product/README.md.
  const cropShift = useTransform(p, [0, 1], reduced ? ['0%', '0%'] : ['-7%', '7%'])

  const markDrift = useTransform(p, [0, 1], reduced ? ['0%', '0%'] : ['-16%', '16%'])

  // Pointer tilt, normalised to -0.5..0.5 across the figure.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const pointerOn = useMotionValue(0)
  const pointerTurn = useTransform(px, [-0.5, 0.5], [-9, 9])

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), SPRING)
  // Pointer and scroll both turn the subject; they add rather than fight.
  const rotateY = useSpring(
    useTransform(() => pointerTurn.get() + scrollTurn.get()),
    SPRING,
  )
  const shadowShift = useSpring(useTransform(px, [-0.5, 0.5], [26, -26]), SPRING)

  const tilt = fine && !reduced

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
    pointerOn.set(1)
  }

  const onLeave = () => {
    px.set(0)
    py.set(0)
    pointerOn.set(0)
  }

  // Picked up from src/assets/product/ by filename. Undefined until somebody
  // drops one in, which is a supported state rather than a missing asset.
  const image = imageFor(item.id)

  return (
    <section
      ref={section}
      id={`panel-${item.id}`}
      aria-labelledby={`item-${item.id}`}
      className="relative flex min-h-[86svh] items-center py-[clamp(3rem,9vh,7rem)] pl-[6vw] pr-[6vw] lg:pr-[11vw]"
    >
      <div className="mx-auto grid w-full max-w-[1500px] gap-y-12 gap-x-[6vw] lg:grid-cols-2 lg:items-start">
        {/* ---- copy ---- */}
        <div className={flipped ? 'lg:order-2 lg:pl-[4vw]' : 'lg:order-1'}>
          <motion.div
            initial={reduced ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            variants={STAGGER}
          >
            <motion.p variants={RISE} className="eyebrow text-ink-faint">
              {String(index + 1).padStart(2, '0')}
            </motion.p>

            <motion.h3 variants={RISE} id={`item-${item.id}`} className="display-h2 mt-5">
              {item.en}
            </motion.h3>

            <motion.p variants={RISE} lang="kn" className="kn-sub mt-3 text-ink-soft">
              {item.kn}
            </motion.p>

            <motion.span variants={RISE} className="mt-8 block h-px w-14 bg-line" />

            <motion.p
              variants={RISE}
              className="mt-8 max-w-[34ch] text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-[1.7] text-ink-soft"
            >
              {item.lead}
            </motion.p>

            {/* The board itself. No prices — this page is about what is made,
                not what it costs. Where the list has not been confirmed yet the
                bracketed stand-in says so rather than inventing one. */}
            {item.lines.length > 0 ? (
              <ul className="mt-9 max-w-[40ch] border-t border-line">
                {item.lines.map((l) => (
                  <motion.li variants={RISE} key={l.name} className="border-b border-line py-4">
                    <h4 className="font-display text-[1.375rem] font-light leading-snug">
                      {l.name}
                      {l.qualifier && (
                        <em className="ml-2.5 text-[0.8125rem] font-normal tracking-wide text-ink-faint">
                          {l.qualifier}
                        </em>
                      )}
                    </h4>
                    {l.desc && (
                      <p className="mt-1.5 text-[0.9375rem] leading-[1.6] text-ink-soft">
                        {l.desc}
                      </p>
                    )}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <motion.p
                variants={RISE}
                className="mt-9 max-w-[40ch] border-t border-line pt-6 text-[0.9375rem] leading-[1.7] text-ink-soft"
              >
                [The {item.en.toLowerCase()} list goes here — names and a line each.]
              </motion.p>
            )}

            {/* ink-faint is too light to read at this size, so the label
                carries the hierarchy instead of the colour. */}
            {item.craft && (
              <motion.div variants={RISE} className="mt-8 max-w-[38ch]">
                <p className="eyebrow text-ink-faint">How we make it</p>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-ink-soft">{item.craft}</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ---- subject ---- */}
        {/* Sticky on wide screens: the card holds in the middle of the
            viewport, turning, while its list scrolls past beside it. */}
        <div
          className={`${flipped ? 'lg:order-1' : 'lg:order-2'} lg:sticky lg:top-[12vh] lg:self-start`}
          style={{ perspective: 1400, perspectiveOrigin: 'center' }}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            className="relative mx-auto aspect-square w-full max-w-[min(72vw,34rem)]"
          >
            {/* Oversized Kannada watermark, set furthest back so it lags the
                card as the panel moves. */}
            <motion.span
              aria-hidden
              lang="kn"
              style={{ x: markDrift, transform: 'translateZ(-120px)' }}
              className="kn pointer-events-none absolute inset-0 grid select-none place-items-center whitespace-nowrap text-[22vw] leading-none text-ink/[0.035] lg:text-[13vw]"
            >
              {item.kn}
            </motion.span>

            <motion.div
              style={{ rotateX, rotateY, scale: cardScale, transformStyle: 'preserve-3d' }}
              className="relative h-full w-full"
            >
              {/* Contact shadow slides opposite the tilt, which sells the depth. */}
              <motion.span
                aria-hidden
                style={{ x: shadowShift, transform: 'translateZ(-60px)' }}
                className="absolute inset-x-[10%] bottom-[2%] h-[14%] rounded-[50%] bg-ink/15 blur-2xl"
              />

              {image ? (
                /* A framed picture rather than a floating cut-out: the frame
                   stays put and the image travels inside it. */
                <div
                  style={{ transform: 'translateZ(55px)' }}
                  className="relative h-full w-full overflow-hidden border border-line bg-paper shadow-[0_30px_60px_-30px_rgba(10,10,10,0.25)]"
                >
                  <motion.img
                    src={image}
                    alt={item.alt ?? ''}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    style={{ y: cropShift }}
                    /* Overscaled so the crop never runs off the frame as it
                       drifts. This is why the image needs a safe area. */
                    className="h-[118%] w-full -translate-y-[9%] select-none object-cover"
                  />
                </div>
              ) : (
                /* No picture for this one yet. Rather than leave a hole or
                   reach for a photograph of someone else's food, the word
                   becomes the subject. Drop a file into
                   src/assets/product/<id>.webp and this is replaced. */
                <div
                  aria-hidden
                  style={{ transform: 'translateZ(55px)' }}
                  className="relative grid h-full w-full place-items-center overflow-hidden border border-line bg-paper shadow-[0_30px_60px_-30px_rgba(10,10,10,0.18)]"
                >
                  <span
                    lang="kn"
                    className="kn px-6 text-center text-[clamp(2.5rem,7vw,4.5rem)] leading-tight text-ink"
                  >
                    {item.kn}
                  </span>
                  <span className="eyebrow absolute bottom-6 text-ink-faint">{item.en}</span>
                </div>
              )}
            </motion.div>

            {/* Only where a picture could be mistaken for one of the named
                items. Set `credit` in src/data/menu.ts. */}
            {image && item.credit && (
              <span className="eyebrow absolute inset-x-0 -bottom-9 text-center text-ink-faint">
                Illustration
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
