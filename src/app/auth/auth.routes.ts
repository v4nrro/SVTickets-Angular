import { Routes } from '@angular/router';
import { leavePageGuard } from '../shared/guards/leave-page.guard';
import { logoutActivateGuard } from '../shared/guards/logout-activate.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
    title: 'Login Page',
    canActivate: [logoutActivateGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
    title: 'Register Page',
    canActivate: [logoutActivateGuard],
    canDeactivate: [leavePageGuard]
  },
];
