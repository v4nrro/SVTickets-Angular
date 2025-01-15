import { ChangeDetectorRef, Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../auth/interfaces/user';
import { OlMapDirective } from '../../ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../ol-maps/ol-marker.directive';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { ProfileService } from '../services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'profile-page',
  imports: [RouterLink, OlMapDirective, OlMarkerDirective, ReactiveFormsModule, ValidationClassesDirective],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
    user = input.required<User>();
    #fb = inject(NonNullableFormBuilder);
    #profileService = inject(ProfileService)
    #destroyRef = inject(DestroyRef);

    isEditingProfile: boolean = false;
    isEditingPassword: boolean = false;

    coordinates = signal<[number, number]>([0, 0]);

    profileForm = this.#fb.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required]]
    });

    passwordForm = this.#fb.group({
        password1: ['', [Validators.required]],
        password2: ['', [Validators.required]],
    })

    constructor(){
        effect(() => {
            if(this.user()){
                this.coordinates.set([this.user().lng, this.user().lat])

                this.profileForm = this.#fb.group({
                    email: [this.user().email,[Validators.required, Validators.email]],
                    name: [this.user().name, [Validators.required]]
                });
            }
        })
    }

    changeProfile(){
        this.#profileService
        .saveProfile(this.profileForm.getRawValue())
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
            console.log("Profile changed!");
            console.log(this.profileForm.getRawValue());
        })
    }

    changePassword(){
        this.#profileService
        .savePassword({
            password: this.passwordForm.getRawValue().password1
        })
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
            console.log("Password changed!");
            console.log(this.passwordForm.getRawValue());
        })
    }

    toggleEditProfile() {
        this.isEditingProfile = !this.isEditingProfile;
        this.isEditingPassword = false;
    }

    toggleEditPassword() {
        this.isEditingPassword = !this.isEditingPassword;
        this.isEditingProfile = false;
    }
}
