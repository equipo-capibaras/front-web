import { TestBed } from '@angular/core/testing';
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorInterceptor } from './error.interceptor';
import { of, throwError, Observable } from 'rxjs';

describe('errorInterceptor', () => {
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: snackBarSpy }],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should handle 401 Unauthorized error', done => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    // Simulamos el comportamiento del next function que debería devolver un Observable de error
    const next: HttpHandlerFn = () => throwError(() => httpErrorResponse);

    interceptor({} as HttpRequest<any>, next).subscribe({
      error: error => {
        expect(error.message).toBe('Usuario o contraseña incorrectos.');
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'Usuario o contraseña incorrectos.',
          'Cerrar',
          { duration: 10000 },
        );
        done();
      },
    });
  });

  it('should pass the request without error', done => {
    // Simulamos una respuesta exitosa
    const httpSuccessResponse: Observable<HttpEvent<any>> = of({} as HttpEvent<any>);

    const next: HttpHandlerFn = () => httpSuccessResponse;

    interceptor({} as HttpRequest<any>, next).subscribe({
      next: response => {
        expect(response).toEqual({} as HttpEvent<any>);
        expect(snackBarSpy.open).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should handle 403 Forbidden error', done => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 403,
      statusText: 'Forbidden',
    });

    const next: HttpHandlerFn = () => throwError(() => httpErrorResponse);

    interceptor({} as HttpRequest<any>, next).subscribe({
      error: error => {
        expect(error.message).toBe('No tienes permiso para acceder a este recurso.');
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'No tienes permiso para acceder a este recurso.',
          'Cerrar',
          { duration: 10000 },
        );
        done();
      },
    });
  });

  it('should handle 404 Not Found error', done => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
    });

    const next: HttpHandlerFn = () => throwError(() => httpErrorResponse);

    interceptor({} as HttpRequest<any>, next).subscribe({
      error: error => {
        expect(error.message).toBe('El recurso solicitado no fue encontrado.');
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'El recurso solicitado no fue encontrado.',
          'Cerrar',
          { duration: 10000 },
        );
        done();
      },
    });
  });

  it('should handle 500 Internal Server Error', done => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    const next: HttpHandlerFn = () => throwError(() => httpErrorResponse);

    interceptor({} as HttpRequest<any>, next).subscribe({
      error: error => {
        expect(error.message).toBe(
          'El servidor está teniendo problemas. Por favor, inténtalo más tarde.',
        );
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'El servidor está teniendo problemas. Por favor, inténtalo más tarde.',
          'Cerrar',
          { duration: 10000 },
        );
        done();
      },
    });
  });

  it('should handle an unknown error', done => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 999,
      statusText: 'Unknown Error',
    });

    const next: HttpHandlerFn = () => throwError(() => httpErrorResponse);

    interceptor({} as HttpRequest<any>, next).subscribe({
      error: error => {
        expect(error.message).toBe('Error 999: Unknown Error');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Error 999: Unknown Error', 'Cerrar', {
          duration: 10000,
        });
        done();
      },
    });
  });
});
