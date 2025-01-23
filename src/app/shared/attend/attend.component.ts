import { Component, effect, model, signal } from '@angular/core';
import { MyEvent } from '../../events/interfaces/MyEvent';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faThumbsDown, faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'attend',
  imports: [FaIconComponent],
  templateUrl: './attend.component.html',
  styleUrl: './attend.component.css'
})
export class AttendComponent {
    icons = { faThumbsUp, faThumbsDown, faUser }

    event = model.required<MyEvent>();
}
