import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MyEvent } from '../interfaces/MyEvent';
import { EventCardComponent } from "../event-card/event-card.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommentsResponse, UsersResponse } from '../../shared/interfaces/responses';
import { DatePipe } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OlMapDirective } from '../../ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../ol-maps/ol-marker.directive';

@Component({
    selector: 'event-detail',
    imports: [EventCardComponent, DatePipe, FormsModule, ReactiveFormsModule, OlMapDirective,
        OlMarkerDirective,],
    templateUrl: './event-detail.component.html',
    styleUrl: './event-detail.component.css'
})

export class EventDetailComponent {

    #title = inject(Title);
    #router = inject(Router);
    #eventsService = inject(EventsService);
    #destroyRef = inject(DestroyRef);
    #fb = inject(NonNullableFormBuilder);
    
    event = input.required<MyEvent>();
    comments = signal<CommentsResponse>({comments: []});
    attendees = signal<UsersResponse>({users: []});

    coordinates = signal<[number, number]>([0, 0]);

    commentForm = this.#fb.group({
        comment: ['', [Validators.required]]
    });

    constructor() {
        effect(() => {
            if(this.event()) {
                this.#title.setTitle(this.event()!.title + ' | Event');
                this.coordinates.set([this.event().lng, this.event().lat])
            }
        });

        effect(() => {
            this.getAttendees();
            this.getComments();
        });
    }

    addComment(){
        this.#eventsService
        .postComment(this.event().id, this.commentForm.getRawValue().comment)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => this.getComments());
    }

    updateLists(){
        this.getAttendees();
        this.getComments();
    }

    getComments(){
        this.#eventsService
        .getComments(this.event().id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((comments) => this.comments.set(comments));
    }

    getAttendees(){
        this.#eventsService
        .getAttendees(this.event().id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((attendees) => this.attendees.set(attendees));
    }

    redirectEventsPage(){
        this.#router.navigate(['/events'])
    }
}
