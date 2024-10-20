import { inject } from '@angular/core';
import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

export const NO_TOKEN = new HttpContextToken<boolean>(() => false);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context?.get(NO_TOKEN)) return next(req);

  const authService = inject(AuthService);

  const token = authService.getToken();
  if (!token) return next(req);

  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(req);
};
