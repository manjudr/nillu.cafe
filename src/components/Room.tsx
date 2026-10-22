import Reveal from './Reveal'
import { roomImageFor } from '../lib/images'

/**
 * One interior picture, or the frame waiting for it.
 *
 * Drop `wide.webp` or `counter.webp` into `src/assets/room/` and it fills.
 * Until then the labelled frame stands in, which is honest — it reads as a
 * space held open rather than as a photograph that failed to load.
 *
 * `alt` is only used once there is a picture. Describe what is actually in the
 * frame; the paragraph above already makes the argument about the room.
 */
function PhotoSlot({
  id,
  label,
  alt,
  className = '',
}: {
  id: string
  label: string
  alt: string
  className?: string
}) {
  const src = roomImageFor(id)

  if (src) {
    return (
      <div className={`relative overflow-hidden border border-line bg-paper ${className}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`relative grid place-items-center overflow-hidden border border-line bg-[#fafafa] ${className}`}
    >
      <span className="eyebrow text-ink-faint/80">{label}</span>
    </div>
  )
}

export default function Room() {
  return (
    <section id="room" className="scroll-mt-24 border-t border-line px-[6vw] py-[clamp(6rem,16vh,12rem)]">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-x-[6vw] gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <Reveal>
            <p lang="kn" className="kn-sub text-ink-faint">
              ಜಾಗ
            </p>
            <h2 className="display-h2 mt-4">The room</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6 text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-[1.7] text-ink-soft lg:pb-3">
              <p>
                Built to be sat in rather than passed through. Come and see it — a photograph
                was never going to settle it anyway.
              </p>
              <p className="text-ink">
                Nobody will hurry you out of the chair. That is most of what we are trying to
                get right.
              </p>
            </div>
          </Reveal>
        </div>

        {/* These two are the only pictures on the site that must be real
            photographs of this room. See src/assets/room/README.md — a
            generated interior here would be a straightforwardly false claim
            about a place a visitor is being invited to walk into. */}
        <Reveal delay={0.08}>
          <div className="mt-[clamp(3rem,8vh,5rem)] grid gap-4 sm:grid-cols-3">
            <PhotoSlot
              id="wide"
              label="Room — wide"
              alt="The seating area at Nillu, looking across the room."
              className="aspect-4/3 sm:col-span-2"
            />
            <PhotoSlot
              id="counter"
              label="Counter — detail"
              alt="A detail of the counter at Nillu."
              className="aspect-4/3"
            />
          </div>
        </Reveal>

      </div>
    </section>
  )
}
