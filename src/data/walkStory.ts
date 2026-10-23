import type { Phase } from '../lib/walkTimeline'

export const WALK_STORY:Record<Phase,{number:string;title:string;accent:string;copy:string}>={
 walk:{number:'01 / STEP INSIDE',title:'Step into a sketch.',accent:'Make a real moment.',copy:'A 2D café opening soon in HSR Layout. Come for coffee, a bite to eat, or something sweet.'},
 coffee:{number:'02 / THE COFFEE',title:'A reason',accent:'to stop.',copy:'A coffee sounds good, doesn’t it?'},
 pause:{number:'03 / THE PAUSE',title:'One sip.',accent:'A little joy.',copy:'Take a sip. Enjoy your coffee.'},
 become:{number:'04 / TAKING SHAPE',title:'That’s',accent:'Nillu.',copy:'“Nillu” means “stop” in Kannada. Come in and take a break.'},
 nillu:{number:'05 / NILLU CAFE',title:'Step into a sketch.',accent:'Make a real moment.',copy:'A 2D café opening soon in HSR Layout. Come for coffee, a bite to eat, or something sweet.'},
}
