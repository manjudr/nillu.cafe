import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScreenQuad } from '@react-three/drei'
import * as THREE from 'three'

import vertexShader from '../shaders/liquid.vert.glsl?raw'
import fragmentSource from '../shaders/liquid.frag.glsl?raw'
import noiseSource from '../shaders/noise.glsl?raw'
import { makeWordTexture, waitForFonts, type WordTexture } from '../lib/wordTexture'
import StillWord from './StillWord'
import { IDENTITY_TYPE } from '../lib/identityType'

// Resolved here rather than by a bundler plugin so the composition is explicit
// and cannot silently no-op into an uncompilable shader.
const fragmentShader = fragmentSource.replace('#include noise.glsl', noiseSource)

const KANNADA = IDENTITY_TYPE.kannada.family
const TELUGU = IDENTITY_TYPE.telugu.family
const LATIN = IDENTITY_TYPE.latin.family

// Latin leads so the first thing anyone sees is a name they can read; the
// Kannada follows as the word the place is actually named for.
const WORDS: Array<{ text: string; font: string; weight: number; suffix: string }> = [
  { text: 'NILLU', suffix: '.cafe', font: LATIN, weight: IDENTITY_TYPE.latin.weight },
  { text: 'ನಿಲ್ಲು', suffix: '.ಕೆಫೆ', font: KANNADA, weight: IDENTITY_TYPE.kannada.weight },
  { text: 'నిల్లు', suffix: '.cafe', font: TELUGU, weight: IDENTITY_TYPE.telugu.weight },
]

// Seconds. The word spends most of the cycle legible; the liquid only takes
// over at the seams.
const FORM = 1.3
const HOLD = 4.2
const MELT = 1.2
const CYCLE = FORM + HOLD + MELT

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function LiquidSurface({ words, story=false }: { words: WordTexture[]; story?:boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const { size, viewport } = useThree()

  const index = useRef(0)
  const clock = useRef(0)
  const pointer = useRef(new THREE.Vector2(0, 0))
  const pointerTarget = useRef(new THREE.Vector2(0, 0))
  const pointerOn = useRef(0)

  const uniforms = useMemo(
    () => ({
      uWord: { value: words[0].texture },
      uForm: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerOn: { value: 0 },
      uTexAspect: { value: words[0].aspect },
      uScale: { value: 0.4 },
      uInk: { value: new THREE.Color('#0a0a0a') },
      uPaper: { value: new THREE.Color('#ffffff') },
    }),
    [words],
  )

  // Fit the word to the viewport: wide on phones, never too tall on desktop.
  const fit = (aspect: number) => {
    const screen = size.width / Math.max(size.height, 1)
    const widthFraction = size.width < 720 ? 0.86 : 0.8
    return Math.min((widthFraction * screen) / aspect, 0.46)
  }

  useEffect(() => {
    const el = document.getElementById(story?'story-word':'hero')
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const screen = r.width / Math.max(r.height, 1)
      pointerTarget.current.set(
        ((e.clientX - r.left) / r.width - 0.5) * screen,
        0.5 - (e.clientY - r.top) / r.height,
      )
      pointerOn.current = 1
    }
    const onLeave = () => {
      pointerOn.current = 0
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [story])

  useFrame((_, delta) => {
    const u = material.current?.uniforms
    if (!u) return

    const step = Math.min(delta, 1 / 30) // keep the sim stable after a tab switch
    clock.current += step
    u.uTime.value += step

    const t = clock.current % CYCLE
    const cycleIndex = Math.floor(clock.current / CYCLE) % words.length

    if (cycleIndex !== index.current) {
      index.current = cycleIndex
      u.uWord.value = words[cycleIndex].texture
      u.uTexAspect.value = words[cycleIndex].aspect
    }

    let form: number
    if (t < FORM) form = easeInOut(t / FORM)
    else if (t < FORM + HOLD) form = 1
    else form = 1 - easeInOut((t - FORM - HOLD) / MELT)
    u.uForm.value = form

    pointer.current.lerp(pointerTarget.current, 1 - Math.pow(0.001, step))
    u.uPointer.value.copy(pointer.current)
    u.uPointerOn.value += (pointerOn.current - u.uPointerOn.value) * (1 - Math.pow(0.01, step))

    u.uResolution.value.set(size.width, size.height)
    u.uScale.value = fit(words[index.current].aspect)
  })

  // viewport is referenced so the surface re-fits on resize.
  void viewport

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  )
}

export default function LiquidHero({paused=false,active=true,story=false}:{paused?:boolean;active?:boolean;story?:boolean}) {
  const [words, setWords] = useState<WordTexture[] | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced) return
    let alive = true
    ;(async () => {
      await waitForFonts([
        [KANNADA, 'ನಿಲ್ಲು .ಕೆಫೆ', IDENTITY_TYPE.kannada.weight],
        [TELUGU, 'నిల్లు', IDENTITY_TYPE.telugu.weight],
        [LATIN, 'NILLU', IDENTITY_TYPE.latin.weight],
      ])
      if (!alive) return
      const selected=story?[{text:'ನಿಲ್ಲು',suffix:'',font:KANNADA,weight:IDENTITY_TYPE.kannada.weight},{text:'NILLU',suffix:'',font:LATIN,weight:IDENTITY_TYPE.latin.weight}]:WORDS
      setWords(selected.map((w) => makeWordTexture(w.text, w.font, w.weight, 1600, w.suffix, !story)))
    })()
    return () => {
      alive = false
    }
  }, [reduced,story])

  useEffect(() => {
    return () => words?.forEach((w) => w.texture.dispose())
  }, [words])

  const still=story?<span lang="kn" className="kannada story-liquid-still">ನಿಲ್ಲು</span>:<StillWord/>
  if (reduced || paused) return still

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      className="absolute inset-0"
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      flat
      fallback={still}
    >
      {words && <LiquidSurface words={words} story={story} />}
    </Canvas>
  )
}
