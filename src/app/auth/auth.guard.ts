import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { defaultRoutes } from '../app.routes';

export const authGuard: CanActivateFn = (route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getRole();

  if (!authService.isAuthenticated() || role === null) {
    router.navigate(['/']);
    return false;
  }

  const roles = route.data['roles'];

  if (!roles.includes(role)) {
    router.navigate([defaultRoutes[role]]);
    return false;
  }

  return true;
};
