import { IDENTITY_TYPE } from '../lib/identityType'
/**
 * Static lockup: what the hero shows before the WebGL chunk arrives, when
 * motion is unwelcome, and when WebGL is unavailable. Deliberately kept free
 * of three.js imports so it can be part of the first paint.
 */
export default function StillWord() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="identity-static-lockup">
        <span
          className="select-none leading-none"
          style={{ fontSize: 'clamp(3rem, 11vw, 10rem)', fontFamily: IDENTITY_TYPE.latin.family, fontWeight: IDENTITY_TYPE.latin.weight, letterSpacing: '-0.045em' }}
        >
          NILLU
        </span>
        <span className="identity-static-suffix" style={{fontFamily: IDENTITY_TYPE.latin.family, fontWeight: IDENTITY_TYPE.latin.weight}}>.cafe</span>
      </div>
    </div>
  )
}
