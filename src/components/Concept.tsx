import Reveal from './Reveal'
import { PRINCIPLES } from '../data/menu'

export default function Concept() {
  return (
    <section id="word" className="scroll-mt-24 px-[6vw] py-[clamp(6rem,16vh,12rem)]">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <p className="eyebrow text-ink-faint">The word</p>
        </Reveal>

        <div className="mt-10 grid gap-x-[6vw] gap-y-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal delay={0.05}>
            <h2
              className="font-display italic leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(3.25rem, 9vw, 8rem)', fontWeight: 300 }}
            >
              nillu
            </h2>
            <p lang="kn" className="kn-sub mt-5 text-ink">
              ನಿಲ್ಲು
            </p>
            <p className="eyebrow mt-6 text-ink-faint">Verb, Kannada</p>
            <p className="mt-4 font-display text-2xl italic text-ink-soft">to stop; to stay put</p>
          </Reveal>

          <Reveal delay={0.12} className="max-w-[46ch]">
            <div className="space-y-7 text-[clamp(1.0625rem,1.35vw,1.3125rem)] leading-[1.75] text-ink-soft">
              <p>
                <span className="text-ink">Nillu means stop.</span> It is the word you say to
                someone walking past who you would rather have stay. That is the whole idea, and
                the name was chosen before anything else was.
              </p>
              <p>
                It is small on purpose. Bengaluru is very good at keeping you moving and not
                especially good at giving you somewhere to stop, so we built a room for the hour
                in the middle of the day that nobody hands you.
              </p>
              <p>
                Coffee, juice, something cold, something sweet, and a chair you are not being
                counted out of. That is the offer.
              </p>
            </div>
          </Reveal>
        </div>

        <ul className="mt-[clamp(4rem,10vh,7rem)] grid gap-px border-t border-line bg-line sm:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.en} delay={i * 0.08} className="bg-paper px-0 pt-10 sm:px-8">
              <h3 className="font-display text-4xl font-light">{p.en}</h3>
              <p lang="kn" className="kn mt-3 text-xl text-ink-faint">
                {p.kn}
              </p>
              <p className="mt-4 max-w-[28ch] leading-relaxed text-ink-soft">{p.note}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
