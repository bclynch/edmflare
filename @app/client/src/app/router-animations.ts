import {
  trigger,
  animate,
  style,
  group,
  query as q,
  transition
} from '@angular/animations';

const query = (style, animate, optional = { optional: true }) =>
  q(style, animate, optional);

export const routerTransition = trigger('routerTransition', [
    transition(':increment', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
        group([
            query(':enter', [style({ transform: 'translateX(100%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))], { optional: true }),
            query(':leave', [style({ transform: 'translateX(0%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))], { optional: true })
        ])
    ]),
    transition(':decrement', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
        group([
            query(':enter', [style({ transform: 'translateX(-100%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))], { optional: true }),
            query(':leave', [style({ transform: 'translateX(0%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))], { optional: true })
        ])
    ])
]);
