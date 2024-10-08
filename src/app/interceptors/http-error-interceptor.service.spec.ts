/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { HttpErrorInterceptorService } from './http-error-interceptor.service';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { throwError } from 'rxjs';

describe('Service: HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptorService;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let next: HttpHandler;

  beforeEach(() => {
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptorService,
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
      imports: [ToastrModule.forRoot()],
    });

    interceptor = TestBed.inject(HttpErrorInterceptorService);
    next = {
      handle: jasmine
        .createSpy('handle')
        .and.returnValue(
          throwError(new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
        ),
    };
  });

  it('should create the interceptor', inject(
    [HttpErrorInterceptorService],
    (service: HttpErrorInterceptorService) => {
      expect(service).toBeTruthy();
    },
  ));

  it('should handle 401 Unauthorized error and show Toastr message', () => {
    const request = new HttpRequest('GET', '/api/data');
    const httpErrorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    interceptor.intercept(request, next).subscribe({
      error: error => {
        expect(error.message).toBe('Username or password is incorrect.');
        expect(toastrServiceSpy.error).toHaveBeenCalledWith(
          'Username or password is incorrect.',
          'Server side error',
          { closeButton: true },
        );
      },
    });
  });

  it('should handle 403 Forbidden error and show Toastr message', () => {
    const request = new HttpRequest('GET', '/api/data');
    const httpErrorResponse = new HttpErrorResponse({
      status: 403,
      statusText: 'Forbidden',
    });

    (next.handle as jasmine.Spy).and.returnValue(throwError(() => httpErrorResponse));

    interceptor.intercept(request, next).subscribe({
      error: error => {
        expect(error.message).toBe('You do not have the necessary permissions.');
        expect(toastrServiceSpy.error).toHaveBeenCalledWith(
          'You do not have the necessary permissions.',
          'Server side error',
          { closeButton: true },
        );
      },
    });
  });

  it('should handle 500 Internal Server Error and show Toastr message', () => {
    const request = new HttpRequest('GET', '/api/data');
    const httpErrorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    (next.handle as jasmine.Spy).and.returnValue(throwError(() => httpErrorResponse));

    interceptor.intercept(request, next).subscribe({
      error: error => {
        expect(error.message).toBe('Internal server error. Please try again later.');
        expect(toastrServiceSpy.error).toHaveBeenCalledWith(
          'Internal server error. Please try again later.',
          'Server side error',
          { closeButton: true },
        );
      },
    });
  });

  it('should not show Toastr message if status is OK', () => {
    const request = new HttpRequest('GET', '/api/data');
    const httpErrorResponse = new HttpErrorResponse({
      status: 200,
      statusText: 'OK',
    });

    (next.handle as jasmine.Spy).and.returnValue(throwError(() => httpErrorResponse));

    interceptor.intercept(request, next).subscribe({
      error: error => {
        expect(toastrServiceSpy.error).not.toHaveBeenCalled();
      },
    });
  });
});
