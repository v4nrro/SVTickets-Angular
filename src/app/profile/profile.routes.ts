import { Routes } from '@angular/router';
import { profileResolver } from './resolvers/profile.resolver';
import { loginActivateGuard } from '../shared/guards/login-activate.guard';

export const profileRoutes: Routes = [
  {
    path: 'me',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
    title: 'My Profile Page',
    resolve: {
        user: profileResolver
    },
    canActivate: [loginActivateGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
    title: 'Profile Page',
    resolve: {
        user: profileResolver
    },
    canActivate: [loginActivateGuard],
  },
];
