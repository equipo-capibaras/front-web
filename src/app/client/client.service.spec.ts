import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';
import {
  ClientService,
  ClientResponse,
  DuplicateEmailError,
  DuplicateEmployeeExistError,
  EmployeeNoFoundError,
  Employee,
  InvitationResponse,
  InvitationNotFoundError,
  InvitationAlreadyAcceptedError,
} from './client.service';
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

  it('should handle HTTP error in loadClientData and send error', fakeAsync(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorResponse: any;

    service.loadClientData().subscribe({
      error: error => {
        errorResponse = error;
      },
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/clients/me`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Server Error' });

    tick();

    expect(errorResponse.status).toBe(500);
    expect(errorResponse.statusText).toBe('Server Error');
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

  it('should handle HTTP error in loadClientEmployees and return an error', fakeAsync(() => {
    let errorResponse: HttpErrorResponse | undefined;

    service.loadClientEmployees(5, 1).subscribe({
      next: () => {
        fail('Expected an error, but got a successful response');
      },
      error: error => {
        errorResponse = error;
      },
    });

    const req = httpTestingController.expectOne(
      `${service['apiUrl']}/employees?page_size=5&page_number=1`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Server Error' });

    tick();

    expect(errorResponse).toBeDefined();
    expect(errorResponse?.status).toBe(500);
    expect(errorResponse?.statusText).toBe('Server Error');
  }));

  it('should send an invitation successfully', waitForAsync(() => {
    const email = 'test@example.com';
    const mockResponse: ClientResponse = {
      id: '1dabcf78-e62a-41fd-b69c-fd7c775b04d4',
      name: 'Mariana Sanchez Torres',
      emailIncidents: '',
      plan: 'accepted',
    };

    service.inviteUser(email).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/employees/invite`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    expect(req.request.context.get(ACCEPTED_ERRORS)).toEqual([409]);
    req.flush(mockResponse);
  }));

  it('should throw DuplicateEmployeeExistError when 409 conflict error occurs', waitForAsync(() => {
    const email = 'duplicate@example.com';

    service.inviteUser(email).subscribe({
      error: error => {
        expect(error).toBeInstanceOf(DuplicateEmployeeExistError);
      },
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/employees/invite`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    expect(req.request.context.get(ACCEPTED_ERRORS)).toEqual([409]);
    req.flush({}, { status: 409, statusText: 'Conflict' });
  }));

  it('should rethrow other errors in inviteUser', waitForAsync(() => {
    const email = 'error@example.com';

    service.inviteUser(email).subscribe({
      error: error => {
        expect(error).not.toBeNull();
        expect(error.status).toBe(500);
      },
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/employees/invite`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should get role by email successfully', waitForAsync(() => {
    const email = 'employee@example.com';
    const mockEmployee: Employee = {
      id: '1',
      clientId: '123',
      name: 'John Doe',
      email,
      role: 'analyst',
      invitationStatus: 'accepted',
      invitationDate: '2024-01-01T00:00:00Z',
    };

    service.getRoleByEmail(email).subscribe(response => {
      expect(response).toEqual(mockEmployee);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/employees/detail`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush(mockEmployee);
  }));

  it('should throw EmployeeNoFoundError when employee not found', waitForAsync(() => {
    const email = 'notfound@example.com';

    service.getRoleByEmail(email).subscribe({
      error: error => {
        expect(error).toBeInstanceOf(EmployeeNoFoundError);
      },
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/employees/detail`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 404, statusText: 'Not Found' });
  }));

  it('should rethrow other errors in getRoleByEmail', waitForAsync(() => {
    const email = 'error@example.com';

    service.getRoleByEmail(email).subscribe({
      error: error => {
        expect(error).not.toBeNull();
        expect(error.status).toBe(500);
      },
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/employees/detail`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should throw InvitationNotFoundError when invitation is not found', waitForAsync(() => {
    const response = InvitationResponse.Accept;

    service.respondInvitation(response).subscribe({
      error: error => {
        expect(error).toBeInstanceOf(InvitationNotFoundError);
      },
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/employees/invitation`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 404, statusText: 'Not Found' });
  }));

  it('should throw InvitationAlreadyAcceptedError when invitation is not found', waitForAsync(() => {
    const response = InvitationResponse.Accept;

    service.respondInvitation(response).subscribe({
      error: error => {
        expect(error).toBeInstanceOf(InvitationAlreadyAcceptedError);
      },
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/employees/invitation`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 409, statusText: 'Conflict' });
  }));

  it('should rethrow other errors in respondInvitation', waitForAsync(() => {
    const response = InvitationResponse.Accept;

    service.respondInvitation(response).subscribe({
      error: error => {
        expect(error).not.toBeNull();
        expect(error.status).toBe(500);
      },
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/employees/invitation`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  }));
});
