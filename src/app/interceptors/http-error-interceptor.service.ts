import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptorService implements HttpInterceptor {
  constructor(private toastrService: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        let errorMesagge = '';
        let errorType = '';

        if (httpErrorResponse.error instanceof HttpErrorResponse) {
          // Cliente (red, etc.)
          errorType = 'Client side error';
          errorMesagge = httpErrorResponse.statusText;
        } else {
          // Servidor
          errorType = 'Server side error';

          switch (httpErrorResponse.status) {
            case 401:
              errorMesagge = 'Username or password is incorrect.';
              break;
            case 403:
              errorMesagge = 'You do not have the necessary permissions.';
              break;
            case 500:
              errorMesagge = 'Internal server error. Please try again later.';
              break;
            default:
              errorMesagge = `${httpErrorResponse.status}: ${httpErrorResponse.statusText}`;
              break;
          }

          if (httpErrorResponse.statusText !== 'OK') {
            this.toastrService.error(errorMesagge, errorType, { closeButton: true });
          }
        }
        return throwError(() => new Error(errorMesagge));
      }),
    );
  }
}
