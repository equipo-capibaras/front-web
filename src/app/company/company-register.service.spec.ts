import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompanyRegisterService } from './company-register.service';

describe('CompanyRegisterService', () => {
  let service: CompanyRegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyRegisterService],
    });

    service = TestBed.inject(CompanyRegisterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully register a company', () => {
    const mockResponse = { id: '123', name: 'Test Company', email: 'test@example.com' };
    const companyData = { name: 'Test Company', email: 'test@example.com' };

    service.registerCompany(companyData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/v1/company');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(companyData);

    req.flush(mockResponse);
  });

  it('should handle "Email already registered" error (409)', () => {
    const companyData = { name: 'Test Company', email: 'duplicate@example.com' };
    const mockError = {
      status: 409,
      statusText: 'Conflict',
      error: { message: 'Email already registered' },
    };

    spyOn(window, 'alert');

    service.registerCompany(companyData).subscribe(response => {
      expect(response).toBeFalse();
    });

    const req = httpMock.expectOne('/api/v1/company');
    req.flush(mockError.error, { status: 409, statusText: 'Conflict' });

    expect(window.alert).toHaveBeenCalledWith(
      'This email is already registered. Please use a different email.',
    );
  });

  it('should handle a generic registration failure', () => {
    const companyData = { name: 'Test Company', email: 'test@example.com' };
    const mockError = { status: 500, statusText: 'Internal Server Error' };

    spyOn(window, 'alert');
    service.registerCompany(companyData).subscribe(response => {
      expect(response).toBeFalse();
    });

    const req = httpMock.expectOne('/api/v1/company');
    req.flush(mockError, { status: 500, statusText: 'Internal Server Error' });

    expect(window.alert).toHaveBeenCalledWith('Company Registration failed. Please try again.');
  });
});
