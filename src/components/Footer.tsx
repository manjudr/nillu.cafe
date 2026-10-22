import Reveal from './Reveal'
import logo from '../assets/logo-ink.png'

export default function Footer() {
  return (
    <footer className="border-t border-line px-[6vw] pb-[clamp(2rem,5vh,3rem)] pt-[clamp(5rem,12vh,9rem)]">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="flex flex-col items-center text-center">
          <h2
            className="font-display leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)', fontWeight: 300 }}
          >
            Walk in
          </h2>
          <p lang="kn" className="kn-sub mt-5 text-ink-soft">
            ಒಳಗೆ ಬನ್ನಿ
          </p>
        </Reveal>

        <div className="mt-[clamp(4rem,10vh,7rem)] flex flex-col items-center gap-8 border-t border-line pt-10 sm:flex-row sm:justify-between">
          <img src={logo} alt="Nillu Café" className="h-9 w-auto" />
          <p className="eyebrow text-ink-faint">HSR Layout · Bengaluru</p>
          <p className="eyebrow text-ink-faint">© {new Date().getFullYear()} Nillu Café</p>
        </div>
      </div>
    </footer>
  )
}
