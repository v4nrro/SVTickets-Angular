import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MyEvent, MyEventInsert } from '../interfaces/MyEvent';
import { EventsResponse, SingleEventResponse } from '../interfaces/responses';
import { map, Observable } from 'rxjs';
import { CommentsResponse, UsersResponse } from '../../shared/interfaces/responses';

@Injectable({
  providedIn: 'root'
})

export class EventsService {

    #eventsUrl = 'events'
    #http = inject(HttpClient);

    getEvents(order: string, currentPage: number, search: string): Observable<MyEvent[]> {
        const params = new URLSearchParams({page: String(currentPage), order, search });

        return this.#http
          .get<EventsResponse>(this.#eventsUrl + "?" + params.toString())
          .pipe(map((resp) => resp.events));
    }

    getEventsCreatedByUser(creator: number, order: string, currentPage: number, search: string): Observable<MyEvent[]> {
        const params = new URLSearchParams({creator: String(creator), page: String(currentPage), order, search });

        return this.#http
          .get<EventsResponse>(this.#eventsUrl + "?" + params.toString())
          .pipe(map((resp) => resp.events));
    }

    getEventsAttending(attendant: number, order: string, currentPage: number, search: string): Observable<MyEvent[]> {
        const params = new URLSearchParams({attending: String(attendant), page: String(currentPage), order, search });

        return this.#http
          .get<EventsResponse>(this.#eventsUrl + "?" + params.toString())
          .pipe(map((resp) => resp.events));
    }

    getEvent(id: number): Observable<MyEvent> {
        return this.#http
            .get<SingleEventResponse>(`${this.#eventsUrl}/${id}`)
            .pipe(map((resp) => resp.event));
    }
    
    addEvent(event: MyEventInsert): Observable<MyEvent> {
            return this.#http
            .post<SingleEventResponse>(this.#eventsUrl, event)
            .pipe(map((resp) => resp.event));
    }

    editEvent(event: MyEventInsert, id: number): Observable<MyEvent> {
        return this.#http
        .put<SingleEventResponse>(`${this.#eventsUrl}/${id}`, event)
        .pipe(map((resp) => resp.event));
    }

    deleteEvent(id: number): Observable<void> {
        return this.#http.delete<void>(`${this.#eventsUrl}/${id}`);
    }

    attendEvent(eventId: number): Observable<void> {
        return this.#http.post<void>(`${this.#eventsUrl}/${eventId}/attend`, {});
    }

    deleteAttend(eventId: number): Observable<void> {
        return this.#http.delete<void>(`${this.#eventsUrl}/${eventId}/attend`);
    }

    getAttendees(eventId: number) : Observable<UsersResponse>{
        return this.#http.get<UsersResponse>(`${this.#eventsUrl}/${eventId}/attend`);
    }

    postComment(eventId: number, userComment: string) : Observable<void> {
        return this.#http.post<void>(`${this.#eventsUrl}/${eventId}/comments`, {comment: userComment});
    }

    getComments(eventId: number) : Observable<CommentsResponse>{
        return this.#http.get<CommentsResponse>(`${this.#eventsUrl}/${eventId}/comments`)
    }
}
