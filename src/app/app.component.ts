import { RouterOutlet } from '@angular/router';
import { TopMenuComponent } from "./shared/top-menu/top-menu.component";
import { Component } from '@angular/core';
import { trigger, transition, query, style, group, animate } from '@angular/animations';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TopMenuComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    animations: [
        trigger('routeAnimation', [
          transition('eventsPage => eventDetail', [
            query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
            query(':enter', style({ transform: 'translateX(100%)' })),
            group([
              query(':leave', [
                animate('0.4s', style({ transform: 'translateX(-100%)' })),
                animate('0.2s', style({ opacity: 0 }))
              ]),
              query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
            ]),
          ]),
          transition('eventDetail => eventsPage', [
            query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
            query(':enter', style({ transform: 'translateX(-100%)' })),
            group([
              query(':leave', [
                animate('0.4s', style({ transform: 'translateX(100%)' })),
                animate('0.2s', style({ opacity: 0 }))
              ]),
              query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
            ]),
          ]),
        ]),
      ],
})
export class AppComponent {
  title = 'angular-svtickets';

  getState(routerOutlet: RouterOutlet) {
    return routerOutlet.activatedRouteData['animation'] || 'None';
  }
}
