export type Phase = 'walk'|'coffee'|'pause'|'become'|'nillu'
export const WALK_DURATION=16.2
export const WALK_STOPS={walk:1.8,coffee:5.2,pause:8.2,become:13,nillu:16.2} as const
// One timeline keeps the words and the drawing in sync. The original pose
// coordinates are retained; only the time between the story beats changes.
export const WALK_TIMELINE=[
 {time:0,scene:0},{time:3.6,scene:3.8},{time:6.9,scene:5.7},
 {time:11.1,scene:7.65},{time:14.8,scene:10.2},{time:16.2,scene:11.6},
] as const
export function walkSceneTime(t:number){
 for(let i=1;i<WALK_TIMELINE.length;i++){
  const a=WALK_TIMELINE[i-1],b=WALK_TIMELINE[i]
  if(t<=b.time)return a.scene+(b.scene-a.scene)*Math.max(0,(t-a.time)/(b.time-a.time))
 }
 return 11.6
}

export function walkPhase(t:number):Phase{const scene=walkSceneTime(t);return scene<3.8?'walk':scene<5.7?'coffee':scene<7.65?'pause':scene<10.2?'become':'nillu'}
