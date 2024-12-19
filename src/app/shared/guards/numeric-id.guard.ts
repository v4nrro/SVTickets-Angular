import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const numericIdGuard: CanActivateFn = (route, state) => {
    const id = +route.paramMap.get('id')!;
    const router = inject(Router);
    if (isNaN(id) || id < 1) {
      return router.createUrlTree(['/events']);
    }

    return true;
};
