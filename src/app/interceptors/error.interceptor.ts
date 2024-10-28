import { inject } from '@angular/core';
import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { AuthService } from '../auth/auth.service';
import { ERROR_MESSAGES } from '../shared/error-messages';

export const ACCEPTED_ERRORS = new HttpContextToken<number[]>(() => []);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (req.context?.get(ACCEPTED_ERRORS).includes(error.status)) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        if (error.error?.message === 'Jwt is expired') {
          authService.handleTokenExpired();
          return throwError(() => new Error(ERROR_MESSAGES.JWT_EXPIRED));
        } else if (error.error?.message === 'Jwt is missing') {
          errorMessage = ERROR_MESSAGES.JWT_MISSING;
        } else {
          errorMessage = ERROR_MESSAGES.AUTH_INVALID;
        }
      } else {
        switch (error.status) {
          case 403:
            errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            break;
          case 404:
            errorMessage = ERROR_MESSAGES.NOT_FOUND;

            break;
          case 500:
            errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }

      snackbarService.showError(errorMessage);

      return throwError(() => new Error(errorMessage));
    }),
  );
};
