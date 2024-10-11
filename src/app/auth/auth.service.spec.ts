import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Role } from './role';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
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
    const tokenkPayload = { aud: role };
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

  it('getRole should return the role from the token payload', () => {
    const role = faker.helpers.arrayElement(Object.values(Role));
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { aud: role };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;
    localStorage.setItem('token', mockToken);

    initComponent();

    expect(service.getRole()).toBe(role);
  });

  it('getRole should return null if the role is invalid', () => {
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { aud: 'unknown' };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;
    localStorage.setItem('token', mockToken);

    initComponent();

    expect(service.getRole()).toBeNull();
  });

  it('logout should remove the token from local storage', () => {
    const tokenHeader = { alg: 'HS256', typ: 'JWT' };
    const tokenkPayload = { aud: 'unknown' };
    const mockToken = `${btoa(JSON.stringify(tokenHeader))}.${btoa(JSON.stringify(tokenkPayload))}.fakeSignature`;
    localStorage.setItem('token', mockToken);

    initComponent();

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.getRole()).toBeNull();
  });
});
