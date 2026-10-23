import type { Phase } from '../lib/walkTimeline'

export const WALK_STORY:Record<Phase,{number:string;title:string;accent:string;copy:string}>={
 walk:{number:'01 / THE WALK',title:'Somewhere',accent:'to be.',copy:'A day full of places to go and things to do.'},
 coffee:{number:'02 / THE COFFEE',title:'A reason',accent:'to stop.',copy:'Sometimes, it starts with a coffee.'},
 pause:{number:'03 / THE PAUSE',title:'One sip.',accent:'A little joy.',copy:'Enjoy the sip. Let the day wait a moment.'},
 become:{number:'04 / TAKING SHAPE',title:'That’s',accent:'Nillu.',copy:'Kannada for “stop.” Our invitation to slow down.'},
 nillu:{number:'05 / NILLU CAFE',title:'A place worth',accent:'pausing for.',copy:'Coffee, fresh flavours, and a warm welcome at Nillu Cafe.'},
}
