import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'events',
        loadChildren: () => import('./events/event.routes').then(m => m.eventsRoutes)
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
    },
    { path: '', redirectTo: '/auth/login',  pathMatch: 'full' },
    { path: '**', redirectTo: '/auth/login' },
];
