import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'me',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
    title: 'Profile Page',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
    title: 'Profile Page',
  },
];
