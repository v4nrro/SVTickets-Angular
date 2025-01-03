import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TokenResponse } from '../../shared/interfaces/responses';
import { UserLogin, User, GoogleFacebookLogin } from '../interfaces/user';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
    #authUrl = 'auth';
    #http = inject(HttpClient);
    #router = inject(Router);
    #logged: WritableSignal<boolean> = signal<boolean>(false);

    getLogged(): boolean {
        return this.#logged();
    }

    isLogged(): Observable<boolean> {
        const token = localStorage.getItem('token');
        
        if (!this.#logged() && !token) {
          return of(false);
        }
    
        if (this.#logged()) {
          return of(true);
        }
    
        if (!this.#logged() && token) {
          return this.checkToken()
            .pipe(map(() => {
              this.#logged.set(true);
              return true;
            }),
            catchError(() => {
              localStorage.removeItem('token');
              this.#logged.set(false);
              return of(false);
            })
          );
        }
        
        return of(false);
    }

    login(userLogin: UserLogin): Observable<TokenResponse> {
        return this.#http
        .post<TokenResponse>(`${this.#authUrl}/login`, userLogin)
        .pipe(map((tokenResponse) => {
            localStorage.setItem('token', tokenResponse.accessToken);
            this.#logged.set(true);
            return tokenResponse;
        }));
    }

    googleLogin(userLogin: GoogleFacebookLogin): Observable<TokenResponse>{
        return this.#http
        .post<TokenResponse>(`${this.#authUrl}/google`, userLogin)
        .pipe(map((tokenResponse) => {
            localStorage.setItem('token', tokenResponse.accessToken);
            this.#logged.set(true);
            return tokenResponse;
        }));
    }

    facebookLogin(userLogin: GoogleFacebookLogin): Observable<TokenResponse>{
        return this.#http
        .post<TokenResponse>(`${this.#authUrl}/facebook`, userLogin)
        .pipe(map((tokenResponse) => {
            localStorage.setItem('token', tokenResponse.accessToken);
            this.#logged.set(true);
            return tokenResponse;
        }));
    }

    register(userInfo: User): Observable<void> {
        return this.#http.post<void>(`${this.#authUrl}/register`, userInfo);
    }

    checkToken(): Observable<void> {
        return this.#http.get<void>(`${this.#authUrl}/validate`);
    }

    logout(): void {
        localStorage.removeItem("token");
        this.#logged.set(false);
        this.#router.navigate(['/events']);
    }
}
