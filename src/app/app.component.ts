import { RouterOutlet } from '@angular/router';
import { TopMenuComponent } from "./shared/top-menu/top-menu.component";
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TopMenuComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-svtickets';
}
