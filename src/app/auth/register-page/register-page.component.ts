import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { Component, DestroyRef, inject } from '@angular/core';
import { equalValues } from '../../shared/validators/equal-values.validator';
import { MyGeolocationService } from '../../shared/services/my-geolocation.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';

@Component({
    selector: 'app-register-page',
    imports: [RouterLink, EncodeBase64Directive, ValidationClassesDirective, ReactiveFormsModule],
    templateUrl: './register-page.component.html',
    styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
    #fb = inject(NonNullableFormBuilder)
    #destroyRef = inject(DestroyRef)
    #saved = false;
    #router = inject(Router)
    #authService = inject(AuthService)

    registerForm = this.#fb.group({
        nameUser: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        avatar: ['', [Validators.required]],
        emailGroup: this.#fb.group(
            {
              email: ['', [Validators.required, Validators.email]],
              email2: '',
            },
            { validators: equalValues('email', 'email2') }
          ), 
    });

    imageBase64 = '';

    coords = toSignal(from(MyGeolocationService.getLocation()), {initialValue:{latitude:0, longitude:0}})

    canDeactivate() {
        return this.#saved || this.registerForm.pristine ||
         confirm('¿Quieres abandonar la página?. Los cambios se perderán...');
    }

    registerUser(){
        this.#authService
        .register({
            name: this.registerForm.getRawValue().nameUser,
            email: this.registerForm.getRawValue().emailGroup.email,
            password: this.registerForm.getRawValue().password,
            avatar: this.imageBase64,
            lat: this.coords().latitude,
            lng: this.coords().longitude,
        })
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
            this.#saved = true;
            this.#router.navigate(['/login']);
        });
    }
}
