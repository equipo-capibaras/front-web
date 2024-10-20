import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';
import { ClientService, ClientResponse, DuplicateEmailError } from './client.service';
import { environment } from '../../environments/environment';
import { ACCEPTED_ERRORS } from '../interceptors/error.interceptor';

describe('ClientService', () => {
  let service: ClientService;
  let httpTestingController: HttpTestingController;

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
});
