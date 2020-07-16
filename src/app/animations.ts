import { trigger, state, style, transition, animate, group, query, stagger, keyframes} from '@angular/animations';

export const SlideInOutAnimation = [
  trigger('slideInOut', [
    state('in', style({
      'display': 'block'
    })),
    state('out', style({
      'display': 'none'
    })),
    transition('in => out', [group([
        animate('100ms ease-in-out', style({
          'opacity': '0'
        })),
        animate('200ms ease-in-out', style({
          'visibility': 'hidden'
        }))
      ]
    )]),
    transition('out => in', [group([
        animate('100ms ease-in-out', style({
          'visibility': 'visible'
        })),
        animate('200ms ease-in-out', style({
          'opacity': '1'
        }))
      ]
    )])
  ]),
];
