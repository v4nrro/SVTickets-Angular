import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenResponse } from '../../shared/interfaces/responses';
import { UserLogin, User, GoogleFacebookLogin } from '../interfaces/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
    #authUrl = 'auth';
    #http = inject(HttpClient);
    #router = inject(Router);

    login(userLogin: UserLogin): Observable<TokenResponse> {
        return this.#http.post<TokenResponse>(`${this.#authUrl}/login`, userLogin)
    }

    googleLogin(userLogin: GoogleFacebookLogin): Observable<TokenResponse>{
        return this.#http.post<TokenResponse>(`${this.#authUrl}/google`, userLogin)
    }

    facebookLogin(userLogin: GoogleFacebookLogin): Observable<TokenResponse>{
        return this.#http.post<TokenResponse>(`${this.#authUrl}/facebook`, userLogin)
    }

    register(userInfo: User): Observable<void> {
        return this.#http.post<void>(`${this.#authUrl}/register`, userInfo);
    }

    checkToken(): Observable<void> {
        return this.#http.get<void>(`${this.#authUrl}/validate`);
    }

    logout(): void {
        localStorage.removeItem("token");
        this.#router.navigate(['/events']);
    }
}
