import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GoogleLoginDirective } from '../../google-login/google-login.directive';
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { MyGeolocationService } from '../../shared/services/my-geolocation.service';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FbLoginDirective } from '../../facebook-login/fb-login.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'login-page',
  imports: [
    RouterLink,
    GoogleLoginDirective,
    ReactiveFormsModule,
    ValidationClassesDirective,
    FbLoginDirective,
    FaIconComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  iconFacebook = faFacebook;
  #authService = inject(AuthService);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  #fb = inject(NonNullableFormBuilder);

  coords = toSignal(from(MyGeolocationService.getLocation()), {
    initialValue: { latitude: 0, longitude: 0 },
  });

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login() {
    this.#authService
      .login({
        email: this.loginForm.getRawValue().email,
        password: this.loginForm.getRawValue().password,
        lat: this.coords().latitude,
        lng: this.coords().longitude,
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result) => {
        localStorage.setItem('token', result.accessToken);
        this.#router.navigate(['/events']);
      });
  }

  loggedFacebook(resp: fb.StatusResponse) {
    this.#authService
    .facebookLogin({
        token: resp.authResponse.accessToken!,
        lat: this.coords().latitude,
        lng: this.coords().longitude
    })
    .pipe(takeUntilDestroyed(this.#destroyRef))
    .subscribe((result) => {
        localStorage.setItem('token', result.accessToken);
        this.#router.navigate(['/events']);
    })
  }

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    this.#authService
      .googleLogin({
        token: resp.credential,
        lat: this.coords().latitude,
        lng: this.coords().longitude,
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result) => {
        localStorage.setItem('token', result.accessToken);
        this.#router.navigate(['/events']);
      });
  }

  showError(error: any) {
    console.error(error);
  }

  logout() {
    this.#authService.logout();
  }
}
