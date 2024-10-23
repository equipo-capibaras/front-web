import { TestBed } from '@angular/core/testing';
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpContext,
} from '@angular/common/http';
import { ACCEPTED_ERRORS, errorInterceptor } from './error.interceptor';
import { of, throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { ERROR_MESSAGES } from '../shared/error-messages';

describe('errorInterceptor', () => {
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  beforeEach(() => {
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['showError']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['handleTokenExpired']);

    TestBed.configureTestingModule({
      providers: [
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
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

    const next: HttpHandlerFn = () => throwError(() => httpErrorResponse);

    interceptor({} as HttpRequest<unknown>, next).subscribe({
      error: error => {
        expect(error.message).toBe(ERROR_MESSAGES.AUTH_INVALID);
        expect(snackbarServiceSpy.showError).toHaveBeenCalledWith(ERROR_MESSAGES.AUTH_INVALID);
        done();
      },
    });
  });

  it('should handle 401 Unauthorized with JWT expired error', done => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 401,
      error: { message: 'Jwt is expired' },
    });

    const next: HttpHandlerFn = () => throwError(() => httpErrorResponse);

    interceptor({} as HttpRequest<unknown>, next).subscribe({
      error: error => {
        expect(error.message).toBe(ERROR_MESSAGES.JWT_EXPIRED);
        expect(authServiceSpy.handleTokenExpired).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should handle 401 Unauthorized with JWT missing error', done => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 401,
      error: { message: 'Jwt is missing' },
    });

    const next: HttpHandlerFn = () => throwError(() => httpErrorResponse);

    interceptor({} as HttpRequest<unknown>, next).subscribe({
      error: error => {
        expect(error.message).toBe(ERROR_MESSAGES.JWT_MISSING);
        expect(snackbarServiceSpy.showError).toHaveBeenCalledWith(ERROR_MESSAGES.JWT_MISSING);
        done();
      },
    });
  });

  it('should pass the request without error', done => {
    const httpSuccessResponse: Observable<HttpEvent<unknown>> = of({} as HttpEvent<unknown>);

    const next: HttpHandlerFn = () => httpSuccessResponse;

    interceptor({} as HttpRequest<unknown>, next).subscribe({
      next: response => {
        expect(response).toEqual({} as HttpEvent<unknown>);
        expect(snackbarServiceSpy.showError).not.toHaveBeenCalled();
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

    interceptor({} as HttpRequest<unknown>, next).subscribe({
      error: error => {
        expect(error.message).toBe(ERROR_MESSAGES.UNAUTHORIZED);
        expect(snackbarServiceSpy.showError).toHaveBeenCalledWith(ERROR_MESSAGES.UNAUTHORIZED);
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

    interceptor({} as HttpRequest<unknown>, next).subscribe({
      error: error => {
        expect(error.message).toBe(ERROR_MESSAGES.NOT_FOUND);
        expect(snackbarServiceSpy.showError).toHaveBeenCalledWith(ERROR_MESSAGES.NOT_FOUND);
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

    interceptor({} as HttpRequest<unknown>, next).subscribe({
      error: error => {
        expect(error.message).toBe(ERROR_MESSAGES.SERVER_ERROR);
        expect(snackbarServiceSpy.showError).toHaveBeenCalledWith(ERROR_MESSAGES.SERVER_ERROR);
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

    interceptor({} as HttpRequest<unknown>, next).subscribe({
      error: error => {
        expect(error.message).toBe('Error 999: Unknown Error');
        expect(snackbarServiceSpy.showError).toHaveBeenCalledWith('Error 999: Unknown Error');
        done();
      },
    });
  });

  it('should rethrow error if status code is in ACCEPTED_ERRORS', done => {
    const acceptedErrorStatus = 400;
    const context = new HttpContext().set(ACCEPTED_ERRORS, [acceptedErrorStatus]);

    const httpErrorResponse = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
    });

    const next: HttpHandlerFn = () => throwError(() => httpErrorResponse);

    interceptor({ context: context } as HttpRequest<unknown>, next).subscribe({
      error: error => {
        expect(error.status).toBe(acceptedErrorStatus);
        done();
      },
    });
  });
});
