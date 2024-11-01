import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';
import {
  EmployeeService,
  EmployeeResponse,
  DuplicateEmailError,
  IncidentListResponse,
} from './employee.service';
import { environment } from '../../environments/environment';
import { ACCEPTED_ERRORS } from '../interceptors/error.interceptor';
import { Role } from '../auth/role';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EmployeeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  const generateEmployeeData = () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement(Object.values(Role)),
  });

  const mockResponse = () => ({
    id: '1',
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'admin',
    invitationStatus: 'pending',
    clientId: '123',
    invitationDate: new Date('2024-01-01T00:00:00Z'),
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new employee successfully', waitForAsync(() => {
    const employeeData = generateEmployeeData();

    const mockResponse: EmployeeResponse = {
      id: faker.string.uuid(),
      clientId: null,
      name: employeeData.name,
      email: employeeData.email,
      role: employeeData.role,
      invitationStatus: 'pending',
      invitationDate: faker.date.past(),
    };

    service.register(employeeData).subscribe({
      next: response => {
        expect(response).toEqual(mockResponse);
      },
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/employees`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(employeeData);
    expect(req.request.context.get(ACCEPTED_ERRORS)).toEqual([409]);
    req.flush(mockResponse);
  }));

  it('should throw DuplicateEmailError when email is already registered', waitForAsync(() => {
    const employeeData = generateEmployeeData();

    service.register(employeeData).subscribe({
      error: error => {
        expect(error).toBeInstanceOf(DuplicateEmailError);
        expect(error.message).toBe('Email already registered.');
      },
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/employees`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(employeeData);
    expect(req.request.context.get(ACCEPTED_ERRORS)).toEqual([409]);
    req.flush({}, { status: 409, statusText: 'Conflict' });
  }));

  it('should rethrow other errors', waitForAsync(() => {
    const employeeData = generateEmployeeData();

    service.register(employeeData).subscribe({
      error: error => {
        expect(error).not.toBeNull();
      },
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/employees`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(employeeData);
    expect(req.request.context.get(ACCEPTED_ERRORS)).toEqual([409]);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should handle HTTP error in loadIncidents and return null', waitForAsync(() => {
    service.loadIncidents(5, 1).subscribe((response: IncidentListResponse | null) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/employees/me/incidents?page_size=5&page_number=1`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Server Error' });
  }));

  it('should return employee response on valid request', () => {
    const employeeData = mockResponse();

    service.validateStatusInvitation().subscribe(response => {
      expect(response).toEqual(employeeData);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/employees/me`);
    expect(req.request.method).toBe('GET');
    req.flush(employeeData);
  });
});
