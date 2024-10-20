import { TestBed } from '@angular/core/testing';
import {
  HttpContext,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { NO_TOKEN, tokenInterceptor } from './token.interceptor';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';

describe('tokenInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => tokenInterceptor(req, next));

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should not add an Authorization header if NO_TOKEN is set', done => {
    const context = new HttpContext().set(NO_TOKEN, true);
    const req = new HttpRequest<unknown>('GET', 'http://localhost:3000', {}, { context: context });

    const httpSuccessResponse: Observable<HttpEvent<unknown>> = of({} as HttpEvent<unknown>);

    const next: HttpHandlerFn = req => {
      expect(req.headers.has('Authorization')).toBe(false);

      return httpSuccessResponse;
    };

    interceptor(req, next).subscribe({
      next: response => {
        expect(response).toEqual({} as HttpEvent<unknown>);
        done();
      },
    });
  });

  it('should add an Authorization header if NO_TOKEN is not set', done => {
    const req = new HttpRequest<unknown>('GET', 'http://localhost:3000');

    const httpSuccessResponse: Observable<HttpEvent<unknown>> = of({} as HttpEvent<unknown>);

    const next: HttpHandlerFn = req => {
      expect(req.headers.has('Authorization')).toBe(true);
      expect(req.headers.get('Authorization')).toBe('Bearer token');

      return httpSuccessResponse;
    };

    authService.getToken.and.returnValue('token');

    interceptor(req, next).subscribe({
      next: response => {
        expect(response).toEqual({} as HttpEvent<unknown>);
        done();
      },
    });
  });

  it('should not add an Authorization header if token is null', done => {
    const req = new HttpRequest<unknown>('GET', 'http://localhost:3000');

    const httpSuccessResponse: Observable<HttpEvent<unknown>> = of({} as HttpEvent<unknown>);

    const next: HttpHandlerFn = req => {
      expect(req.headers.has('Authorization')).toBe(false);

      return httpSuccessResponse;
    };

    authService.getToken.and.returnValue(null);

    interceptor(req, next).subscribe({
      next: response => {
        expect(response).toEqual({} as HttpEvent<unknown>);
        done();
      },
    });
  });
});
