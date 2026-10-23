import type { Phase } from '../lib/walkTimeline'

export const WALK_STORY:Record<Phase,{number:string;title:string;accent:string;copy:string}>={
 walk:{number:'01 / STEP INSIDE',title:'Step into a sketch.',accent:'Make a real moment.',copy:'A playful 2D café, coming soon to HSR Layout. Coffee, food, something sweet—and a warm welcome.'},
 coffee:{number:'02 / THE COFFEE',title:'A reason',accent:'to stop.',copy:'Sometimes, it starts with a coffee.'},
 pause:{number:'03 / THE PAUSE',title:'One sip.',accent:'A little joy.',copy:'Enjoy the sip. Let the day wait a moment.'},
 become:{number:'04 / TAKING SHAPE',title:'That’s',accent:'Nillu.',copy:'Kannada for “stop.” Our invitation to slow down.'},
 nillu:{number:'05 / NILLU CAFE',title:'Step into a sketch.',accent:'Make a real moment.',copy:'A playful 2D café, coming soon to HSR Layout. Coffee, food, something sweet—and a warm welcome.'},
}
