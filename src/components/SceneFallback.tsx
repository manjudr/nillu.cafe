import { Component } from 'react'
import type { ReactNode } from 'react'

const transparent = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

/** Motion visitors must not download or flash a photo before the live scene. */
export default function SceneFallback({image,reduced}:{image:string;reduced:boolean}) {
 return <>
  <img className="scene-fallback scene-placeholder" src={reduced?image:transparent} alt="" loading="lazy"/>
  {!reduced&&<noscript><img className="scene-fallback" src={image} alt="Illustration of this Nillu Cafe food category" loading="lazy"/></noscript>}
 </>
}

export class SceneBoundary extends Component<{children:ReactNode;image:string},{failed:boolean}> {
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<img className="scene-fallback scene-error-fallback" src={this.props.image} alt="Illustration of this Nillu Cafe food category"/>:this.props.children}
}
