import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'events',
        loadChildren: () => import('./events/event.routes').then(m => m.eventsRoutes),
        data: { animation: 'eventsPage' }
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/profile.routes').then(m => m.profileRoutes),
    },
    { path: '', redirectTo: '/auth/login',  pathMatch: 'full' },
    { path: '**', redirectTo: '/auth/login' },
];
