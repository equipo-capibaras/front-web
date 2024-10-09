import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      // Identificar el tipo de error según el código de estado
      switch (error.status) {
        case 401:
          errorMessage = 'Usuario o contraseña incorrectos.';
          break;
        case 403:
          errorMessage = 'No tienes los permisos necesarios para realizar esta acción.';
          break;
        case 404:
          errorMessage = 'El recurso solicitado no fue encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Por favor, intenta nuevamente más tarde.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText}`;
      }

      // Mostrar el SnackBar con el mensaje de error y duración de 5 segundos
      snackBar.open(errorMessage, 'Cerrar', {
        duration: 10000,
      });

      // Propagar el error para que sea manejado en otros lugares si es necesario
      return throwError(() => new Error(errorMessage));
    }),
  );
};
