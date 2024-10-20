import { inject } from '@angular/core';
import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const ACCEPTED_ERRORS = new HttpContextToken<number[]>(() => []);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (req.context?.get(ACCEPTED_ERRORS).includes(error.status)) {
        return throwError(() => error);
      }

      // Identificar el tipo de error según el código de estado
      switch (error.status) {
        case 401:
          errorMessage = $localize`:@@error-401:Usuario o contraseña incorrectos.`;
          break;
        case 403:
          errorMessage = $localize`:@@error-403:No tienes permiso para acceder a este recurso.`;
          break;
        case 404:
          errorMessage = $localize`:@@error-404:El recurso solicitado no fue encontrado.`;
          break;
        case 500:
          errorMessage = $localize`:@@error-500:El servidor está teniendo problemas. Por favor, inténtalo más tarde.`;
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText}`;
      }

      snackBar.open(errorMessage, $localize`:@@snackbarClose:Cerrar`, {
        duration: 10000,
      });

      return throwError(() => new Error(errorMessage));
    }),
  );
};
