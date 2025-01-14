import { Component, effect, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../auth/interfaces/user';
import { OlMapDirective } from '../../ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../ol-maps/ol-marker.directive';

@Component({
  selector: 'profile-page',
  imports: [RouterLink, OlMapDirective, OlMarkerDirective],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
    user = input.required<User>();

    isEditingProfile: boolean = false;
    isEditingPassword: boolean = false;

    coordinates = signal<[number, number]>([0, 0]);

    constructor(){
        effect(() => {
            if(this.user()){
                this.coordinates.set([this.user().lng, this.user().lat])
            }
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
