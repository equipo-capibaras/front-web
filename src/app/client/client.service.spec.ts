import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';
import { ClientService, ClientResponse, DuplicateEmailError } from './client.service';
import { environment } from '../../environments/environment';
import { ACCEPTED_ERRORS } from '../interceptors/error.interceptor';
import { Client } from './client';
import { EmployeeListResponse } from './employee-list/employee-list';

describe('ClientService', () => {
  let service: ClientService;
  let httpTestingController: HttpTestingController;

  const mockClientData: Client = {
    id: '1',
    name: 'Empresa S.A.S',
    plan: 'empresario',
    emailIncidents: 'pqrs-empresa@capibaras.io',
  };

  const mockEmployeeListResponse: EmployeeListResponse = {
    employees: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        invitationStatus: 'accepted',
        clientId: '123',
        invitationDate: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'analyst',
        invitationStatus: 'pending',
        clientId: '124',
        invitationDate: '2024-01-02T00:00:00Z',
      },
    ],
    totalEmployees: 10,
    currentPage: 1,
    totalPages: 5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ClientService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const generateClientData = () => ({
    name: faker.person.fullName(),
    prefixEmailIncidents: faker.internet.email(),
  });

  it('should register a new client successfully', waitForAsync(() => {
    const clientData = generateClientData();

    const mockResponse: ClientResponse = {
      id: faker.string.uuid(),
      name: clientData.name,
      emailIncidents: clientData.prefixEmailIncidents + '@capibaras.io',
      plan: null,
    };

    service.register(clientData).subscribe({
      next: response => {
        expect(response).toEqual(mockResponse);
      },
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/clients`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(clientData);
    expect(req.request.context.get(ACCEPTED_ERRORS)).toEqual([409]);
    req.flush(mockResponse);
  }));

  it('should throw DuplicateEmailError when email is already registered', waitForAsync(() => {
    const clientData = generateClientData();

    service.register(clientData).subscribe({
      error: error => {
        expect(error).toBeInstanceOf(DuplicateEmailError);
        expect(error.message).toBe('Email already registered.');
      },
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/clients`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(clientData);
    expect(req.request.context.get(ACCEPTED_ERRORS)).toEqual([409]);
    req.flush({}, { status: 409, statusText: 'Conflict' });
  }));

  it('should rethrow other errors', waitForAsync(() => {
    const clientData = generateClientData();

    service.register(clientData).subscribe({
      error: error => {
        expect(error).not.toBeNull();
      },
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/clients`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(clientData);
    expect(req.request.context.get(ACCEPTED_ERRORS)).toEqual([409]);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should save a plan successfully', waitForAsync(() => {
    const planName = faker.helpers.arrayElement(['emprendedor', 'empresario', 'empresario_plus']);

    service.savePlan(planName).subscribe({
      next: response => {
        expect(response).toBeTrue();
      },
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/clients/me/plan/${planName}`,
    );
    expect(req.request.method).toBe('POST');
    req.flush({});
  }));

  it('should return false when saving a plan fails', waitForAsync(() => {
    const planName = faker.helpers.arrayElement(['emprendedor', 'empresario', 'empresario_plus']);

    service.savePlan(planName).subscribe({
      next: response => {
        expect(response).toBeFalse();
      },
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/clients/me/plan/${planName}`,
    );
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should load client data and update the subject', fakeAsync(() => {
    let result: Client | null = null;

    service.loadClientData().subscribe((response: Client | null) => {
      result = response;
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/clients/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClientData);

    tick();

    expect(result).not.toBeNull();
    if (result !== null) {
      expect(result).toEqual(mockClientData);
    }
  }));

  it('should handle HTTP error in loadClientData and set null', fakeAsync(() => {
    let result: Client | null = null;

    service.loadClientData().subscribe((response: Client | null) => {
      result = response;
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/clients/me`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Server Error' });

    tick();

    expect(result).toBeNull();
  }));

  it('should load employee data and return EmployeeListResponse', fakeAsync(() => {
    let result: EmployeeListResponse | null = null;

    service.loadClientEmployees(5, 1).subscribe((response: EmployeeListResponse | null) => {
      result = response;
    });

    const req = httpTestingController.expectOne(
      `${service['apiUrl']}/employees?page_size=5&page_number=1`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployeeListResponse);

    tick();

    expect(result).not.toBeNull();
    if (result !== null) {
      expect(result).toEqual(mockEmployeeListResponse);
    }
  }));

  it('should handle HTTP error in loadClientEmployees and return null', fakeAsync(() => {
    let result: EmployeeListResponse | null = null;

    service.loadClientEmployees(5, 1).subscribe((response: EmployeeListResponse | null) => {
      result = response;
    });

    const req = httpTestingController.expectOne(
      `${service['apiUrl']}/employees?page_size=5&page_number=1`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Server Error' });

    tick();

    expect(result).toBeNull();
  }));
});
