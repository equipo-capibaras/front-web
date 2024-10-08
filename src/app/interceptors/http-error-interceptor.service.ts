import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptorService extends HttpErrorResponse {
  constructor(private toastrService: ToastrService) {
    super(toastrService);
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        let errorMesagge = '';
        let errorType = '';

        if (httpErrorResponse.error instanceof HttpErrorResponse) {
          errorType = 'Client side error';
          errorMesagge = httpErrorResponse.statusText;
        } else {
          errorType = 'Server side error';
          if (httpErrorResponse.status === 0) {
            errorMesagge = 'No connection to the server';
          } else {
            errorMesagge = `${httpErrorResponse.status}: ${httpErrorResponse.statusText}`;
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
