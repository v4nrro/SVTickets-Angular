import { Component, DestroyRef, effect, inject, input } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MyEvent } from '../interfaces/MyEvent';
import { EventCardComponent } from "../event-card/event-card.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'event-detail',
    imports: [EventCardComponent],
    templateUrl: './event-detail.component.html',
    styleUrl: './event-detail.component.css'
})

export class EventDetailComponent {

    #eventsService = inject(EventsService);
    #title = inject(Title);
    #router = inject(Router);
    #destroyRef = inject(DestroyRef)
    
    event = input.required<MyEvent>();

    constructor() {
        effect(() => {
            if(this.event()) {
                this.#title.setTitle(this.event()!.title + ' | Event');
            }
        });
    }

    deleteEvent(){
        this.#eventsService
        .deleteEvent(this.event()!.id!)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => this.#router.navigate(['/events']));
    }

    goBack(){
        location.assign('/events');
    }
}
