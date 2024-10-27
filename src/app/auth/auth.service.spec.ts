import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Role } from './role';
import { ERROR_MESSAGES } from '../shared/error-messages';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['showError']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  function initComponent() {
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }

  it('should be created', () => {
    initComponent();
    expect(service).toBeTruthy();
  });

  it('login should return true on successful login', () => {
    const username = faker.internet.email();
    const password = faker.internet.password();
    const role = faker.helpers.arrayElement(Object.values(Role));
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { role: role };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;

    initComponent();

    service.login(username, password).subscribe(result => {
      expect(result).toBe(true);
      expect(localStorage.getItem('token')).toBe(mockToken);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/employee`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username, password });
    req.flush({ token: mockToken });
  });

  it('login should return false on failed login', () => {
    const username = faker.internet.email();
    const password = faker.internet.password();

    initComponent();

    service.login(username, password).subscribe(result => {
      expect(result).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/employee`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username, password });
    req.flush(
      {
        message: 'Invalid username or password.',
        code: 401,
      },
      { status: 401, statusText: 'Unauthorized' },
    );
  });

  it('getRole should return null if no token exists', () => {
    initComponent();

    expect(service.getRole()).toBeNull();
  });

  it('isUnassigned should return null if no token exists', () => {
    initComponent();

    expect(service.isUnassigned()).toBeNull();
  });

  it('getRole should return the role from the token payload', () => {
    const role = faker.helpers.arrayElement(Object.values(Role));
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { role: role };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;
    localStorage.setItem('token', mockToken);

    initComponent();

    expect(service.getRole()).toBe(role);
  });

  it('getRole should return null if the role is invalid', () => {
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { role: 'unknown' };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;
    localStorage.setItem('token', mockToken);

    initComponent();

    expect(service.getRole()).toBeNull();
  });

  it('getRole should return null if the token is invalid', () => {
    localStorage.setItem('token', 'invalidToken');

    initComponent();

    expect(service.getRole()).toBeNull();
  });

  it('logout should remove the token from local storage', () => {
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { role: 'unknown' };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;
    localStorage.setItem('token', mockToken);

    initComponent();

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.getRole()).toBeNull();
  });

  it('getToken should return the token from local storage', () => {
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { role: 'unknown' };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;
    localStorage.setItem('token', mockToken);

    initComponent();

    expect(service.getToken()).toBe(mockToken);
  });

  it('refreshToken should return true on successful refresh', () => {
    const role = faker.helpers.arrayElement(Object.values(Role));
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { role: role };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;

    initComponent();

    service.refreshToken().subscribe(result => {
      expect(result).toBe(true);
      expect(localStorage.getItem('token')).toBe(mockToken);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/employee/refresh`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: mockToken });
  });

  it('refreshToken should return false on failed refresh', () => {
    initComponent();

    service.refreshToken().subscribe(result => {
      expect(result).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/employee/refresh`);
    expect(req.request.method).toBe('POST');
    req.flush(
      {
        message: 'Internal Server Error',
        code: 500,
      },
      { status: 500, statusText: 'Internal Server Error' },
    );
  });

  it('handleTokenExpired should remove token, show error, and navigate to login', () => {
    initComponent();

    localStorage.setItem('token', 'fakeToken');
    service.handleTokenExpired();
    expect(localStorage.getItem('token')).toBeNull();
    expect(snackbarServiceSpy.showError).toHaveBeenCalledWith(ERROR_MESSAGES.JWT_EXPIRED);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('isUnassigned should return the true if unassigned', () => {
    const role = faker.helpers.arrayElement(Object.values(Role));
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { aud: 'unassigned_' + role };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;
    localStorage.setItem('token', mockToken);

    initComponent();

    expect(service.isUnassigned()).toBe(true);
  });
});
