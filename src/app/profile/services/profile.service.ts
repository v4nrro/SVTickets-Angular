import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserProfileEdit, UserPasswordEdit, UserPhotoEdit, User } from '../../auth/interfaces/user';
import { SingleUserResponse } from '../../shared/interfaces/responses';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
        
    #profileUrl = 'users';
    #http = inject(HttpClient);
    

    getProfile(id?: number): Observable<User> {
        return this.#http
        .get<SingleUserResponse>(`${this.#profileUrl}/${id}`)
        .pipe(map((resp) => resp.user));
    }

    getMyProfile(): Observable<User> {
        return this.#http
        .get<SingleUserResponse>(`${this.#profileUrl}/me`)
        .pipe(map((resp) => resp.user));
    }

    saveProfile(profile: UserProfileEdit): Observable<void> {
        return this.#http.put<void>(`${this.#profileUrl}/me`, profile);
    }

    savePassword(password: UserPasswordEdit): Observable<void> {
        return this.#http.put<void>(`${this.#profileUrl}/me/password`, password);
    }

    saveAvatar(avatar: UserPhotoEdit): Observable<void> {
        return this.#http.put<void>(`${this.#profileUrl}/me/photo`, avatar);
    }
}
