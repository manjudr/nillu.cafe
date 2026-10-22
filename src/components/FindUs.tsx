import Reveal from './Reveal'
import { DETAILS, GOOD_TO_KNOW } from '../data/menu'

export default function FindUs() {
  return (
    <section id="find" className="scroll-mt-24 border-t border-line px-[6vw] py-[clamp(6rem,16vh,12rem)]">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <p lang="kn" className="kn-sub text-ink-faint">
            ಎಲ್ಲಿದ್ದೇವೆ
          </p>
          <h2 className="display-h2 mt-4">Find us</h2>
        </Reveal>

        <div className="mt-[clamp(3rem,8vh,5rem)] grid gap-x-[6vw] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={0.06}>
            <h3 className="eyebrow text-ink-faint">Address</h3>
            <address className="mt-5 not-italic text-[1.0625rem] leading-[1.8] text-ink-soft">
              {DETAILS.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <a
              href={DETAILS.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="eyebrow mt-6 inline-block border-b border-ink pb-1 text-ink transition-opacity duration-300 hover:opacity-60"
            >
              Open in maps
            </a>
          </Reveal>

          <Reveal delay={0.12}>
            <h3 className="eyebrow text-ink-faint">Say hello</h3>
            <ul className="mt-5 space-y-3 text-[1.0625rem] text-ink-soft">
              <li>
                <a
                  href={DETAILS.instagram.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors duration-300 hover:text-ink"
                >
                  {DETAILS.instagram.handle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${DETAILS.email}`}
                  className="transition-colors duration-300 hover:text-ink"
                >
                  {DETAILS.email}
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.18} className="sm:col-span-2 lg:col-span-1">
            <h3 className="eyebrow text-ink-faint">Hours</h3>
            <dl className="mt-5 space-y-3 text-[1.0625rem] text-ink-soft">
              {DETAILS.hours.map((h) => (
                <div key={h.days} className="flex flex-wrap gap-x-3">
                  <dt>{h.days}</dt>
                  <dd className="text-ink">{h.time}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* The practical answers, stated as facts rather than as a list of
            things the café will not do. */}
        <Reveal delay={0.1}>
          <h3 className="eyebrow mt-[clamp(4rem,10vh,7rem)] text-ink-faint">Good to know</h3>
          <dl className="mt-8 grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {/* Every cell that starts a row loses its left padding so the
                column of headings stays flush with the section label. */}
            {GOOD_TO_KNOW.map((g) => (
              <div
                key={g.q}
                className="bg-paper py-7 sm:px-8 sm:[&:nth-child(2n+1)]:pl-0 lg:[&:nth-child(2n+1)]:pl-8 lg:[&:nth-child(3n+1)]:pl-0"
              >
                <dt className="font-display text-2xl font-light">{g.q}</dt>
                <dd className="mt-2.5 max-w-[30ch] text-[0.9375rem] leading-[1.65] text-ink-soft">
                  {g.a}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
