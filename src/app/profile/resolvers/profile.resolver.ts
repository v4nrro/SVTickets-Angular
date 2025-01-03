import { ResolveFn, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { User } from '../../auth/interfaces/user';

export const profileResolver: ResolveFn<User> = (route, state) => {
    const eventsService = inject(ProfileService);
    const router = inject(Router);

    const id = +route.paramMap.get('id')!;

    if (id === 0) {
        return eventsService.getMyProfile().pipe(
            catchError(() => {
                router.navigate(['/auth/login']);
                return EMPTY;
            })
        );
    }
    else{
        return eventsService.getProfile(id).pipe(
            catchError(() => {
                router.navigate(['/events']);
                return EMPTY;
            })
        );
    }
};
