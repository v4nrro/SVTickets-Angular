import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SingleUserResponse } from '../../shared/interfaces/responses';
import { map, Observable } from 'rxjs';
import { User, UserPasswordEdit, UserPhotoEdit, UserProfileEdit } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    #eventsUrl = 'users'
    #http = inject(HttpClient);

    getProfile(id?: number): Observable<User> {
        return this.#http
        .get<SingleUserResponse>(`${this.#eventsUrl}/${id}`)
        .pipe(map((resp) => resp.user));
    }

    getMyProfile(): Observable<User> {
        return this.#http
        .get<SingleUserResponse>(`${this.#eventsUrl}/me`)
        .pipe(map((resp) => resp.user));
    }

    saveProfile(profile: UserProfileEdit): Observable<void> {
        return this.#http.put<void>(`${this.#eventsUrl}/me`, profile)
    }

    savePassword(password: UserPasswordEdit): Observable<void> {
        return this.#http.put<void>(`${this.#eventsUrl}/me/password`, password)
    }

    saveAvatar(avatar: UserPhotoEdit): Observable<void> {
        return this.#http.put<void>(`${this.#eventsUrl}/me/photo`, avatar)
    }
}
