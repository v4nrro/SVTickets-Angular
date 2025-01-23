import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { IntlCurrencyPipe } from '../../shared/pipes/events-filter.pipe';
import { MyEvent } from '../interfaces/MyEvent';
import { EventsService } from '../services/events.service';
import { AttendComponent } from "../../shared/attend/attend.component";
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faStar as faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
    selector: 'event-card',
    imports: [IntlCurrencyPipe, DatePipe, RouterLink, AttendComponent, FaIconComponent],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.css'
})

export class EventCardComponent {
    icons = { faTrash }

    event = input.required<MyEvent>();
    deleted = output<void>();
    attended = output<void>();

    #eventsService = inject(EventsService);
    #destroyRef = inject(DestroyRef);
    #changeDetector = inject(ChangeDetectorRef);

    deleteEvent() {
        this.#eventsService
          .deleteEvent(this.event().id!)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => this.deleted.emit());
    }

    attendEvent(attend: boolean) {
        const oldAttend = this.event().attend;
        const oldNumAttend = this.event().numAttend;

        this.event().attend = attend;
        this.event().numAttend ++;

        this.#eventsService
        .attendEvent(this.event().id!)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
            next: () => {
                this.attended.emit();
            },
            error: () => {
                this.event().attend = oldAttend;
                this.event().numAttend = oldNumAttend;
                this.#changeDetector.markForCheck();
            }
        });
       
    }

    deleteAttend(attend: boolean) {
        const oldAttend = this.event().attend;
        const oldNumAttend = this.event().numAttend;

        this.event().attend = attend;
        this.event().numAttend --;

        this.#eventsService
        .deleteAttend(this.event().id!)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
            next: () => {
                this.attended.emit();
            },
            error: () => {
                this.event().attend = oldAttend;
                this.event().numAttend = oldNumAttend;
                this.#changeDetector.markForCheck();
            }
        });
    }
}
