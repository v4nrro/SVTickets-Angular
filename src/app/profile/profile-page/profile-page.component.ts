import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../auth/interfaces/user';

@Component({
  selector: 'profile-page',
  imports: [RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
    user = input.required<User>();

    isEditingProfile: boolean = false;
    isEditingPassword: boolean = false;

    toggleEditProfile() {
        this.isEditingProfile = !this.isEditingProfile;
        this.isEditingPassword = false;
    }

    toggleEditPassword() {
        this.isEditingPassword = !this.isEditingPassword;
        this.isEditingProfile = false;
    }
}
