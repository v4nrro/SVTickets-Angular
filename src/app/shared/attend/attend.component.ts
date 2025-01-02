import { Component, effect, model, signal } from '@angular/core';
import { MyEvent } from '../../events/interfaces/MyEvent';

@Component({
  selector: 'attend',
  imports: [],
  templateUrl: './attend.component.html',
  styleUrl: './attend.component.css'
})
export class AttendComponent {
    event = model.required<MyEvent>();
}
