import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';
import {
  IncidentService,
  IncidentListResponse,
  HistoryResponse,
  IncidentClosedError,
  IncidentNotFoundError,
  UserNotFoundError,
} from './incident.service';
import { Incident, IncidentHistory } from './incident';
import { Employee } from '../employee/employee';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(IncidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function randomIncident() {
    return {
      name: faker.lorem.words(3),
      email: faker.internet.email(),
      description: faker.lorem.words(10),
    };
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadIncidents', () => {
    it('should return a list of incidents on success', () => {
      const mockResponse: IncidentListResponse = {
        incidents: [
          {
            id: '1',
            name: 'Test Incident',
            reportedBy: { id: '10', name: 'John Doe', email: 'johndoe@example.com' } as Employee,
            filingDate: new Date(),
            status: 'open',
          },
        ],
        totalPages: 1,
        currentPage: 1,
        totalIncidents: 1,
      };

      service.loadIncidents(10, 1).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/employees/me/incidents?page_size=10&page_number=1`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should throw an error on failure', () => {
      const errorMessage = 'Internal Server Error';
      const status = 500;

      service.loadIncidents(10, 1).subscribe({
        next: () => fail('Expected an error, but got a success response'),
        error: (error: HttpErrorResponse) => {
          expect(error).toBeTruthy();
          expect(error.status).toBe(status);
          expect(error.message).toContain(errorMessage);
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/employees/me/incidents?page_size=10&page_number=1`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status, statusText: 'Internal Server Error' });
    });
  });

  describe('incidentDetail', () => {
    it('should return incident details on success', () => {
      const mockEmployee: Employee = {
        id: '10',
        name: 'John Doe',
        email: 'johndoe@example.com',
        clientId: '',
        role: 'agent',
        invitationStatus: 'accepted',
        invitationDate: '',
      };

      const mockIncidentHistory: IncidentHistory[] = [
        { seq: 1, date: '2023-01-01', action: 'created', description: 'Incident created' },
        { seq: 2, date: '2023-01-02', action: 'escalated', description: 'Incident escalated' },
      ];

      const mockIncident: Incident = {
        id: '1',
        name: 'Test Incident',
        channel: 'web',
        reportedBy: mockEmployee,
        createdBy: mockEmployee,
        assignedTo: mockEmployee,
        history: mockIncidentHistory,
      };

      service.incidentDetail('1').subscribe(incident => {
        expect(incident).toEqual(mockIncident);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/incidents/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockIncident);
    });

    it('should throw an error on failure', () => {
      const errorMessage = 'Not Found';
      const status = 404;

      service.incidentDetail('1').subscribe({
        next: () => fail('Expected an error, but got a success response'),
        error: (error: HttpErrorResponse) => {
          expect(error).toBeTruthy();
          expect(error.status).toBe(status);
          expect(error.message).toContain(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/incidents/1`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status, statusText: 'Not Found' });
    });
  });

  it('should change incident status successfully', () => {
    const status = 'escalated';
    const description = 'Updated status';

    const mockResponse: HistoryResponse = {
      seq: 1,
      date: '2024-11-02T15:06:13Z',
      action: status,
      description,
    };

    service.changeStatusIncident(status, description, '1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/incidents/1/update`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      action: status,
      description: description,
    });
    req.flush(mockResponse);
  });

  it('should handle 409 error when changing incident status', () => {
    const status = 'Escalated';
    const description = 'Updated status';

    service.changeStatusIncident(status, description, '1').subscribe({
      next: () => fail('should have failed with 409 error'),
      error: error => {
        expect(error).toBeInstanceOf(IncidentClosedError);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/incidents/1/update`);
    req.flush('Conflict', { status: 409, statusText: 'Conflict' });
  });

  it('should handle 404 error when changing incident status', () => {
    const status = 'Escalated';
    const description = 'Updated status';

    service.changeStatusIncident(status, description, '1').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: error => {
        expect(error).toBeInstanceOf(IncidentNotFoundError);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/incidents/1/update`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle other errors when changing incident status', () => {
    const status = 'Escalated';
    const description = 'Updated status';

    service.changeStatusIncident(status, description, '1').subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/incidents/1/update`);
    req.flush('Server error', { status: 500, statusText: 'Server error' });
  });

  it('should handle 404 error when creating incident', () => {
    const incidentData = randomIncident();

    service.registerIncident(incidentData).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: error => {
        expect(error).toBeInstanceOf(UserNotFoundError);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/incidents/web`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle other errors when creating incident', () => {
    const incidentData = randomIncident();

    service.registerIncident(incidentData).subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/incidents/web`);
    req.flush('Server error', { status: 500, statusText: 'Server error' });
  });

  it('should return AI suggestions on success', () => {
    const incidentId = '1';
    const locale = 'es-CO';
    const mockSuggestionsAI = {
      steps: [
        { text: 'Step 1', detail: 'Detail 1' },
        { text: 'Step 2', detail: 'Detail 2' },
      ],
    };

    service.AISuggestions(incidentId, locale).subscribe(suggestions => {
      expect(suggestions).toEqual(mockSuggestionsAI);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/incidents/${incidentId}/generativeai/suggestions?locale=${locale}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockSuggestionsAI);
  });
  it('should throw an error when AISuggestions fails', () => {
    const incidentId = '1';
    const locale = 'es-CO';
    const errorMessage = 'Internal Server Error';
    const status = 500;

    service.AISuggestions(incidentId, locale).subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error: HttpErrorResponse) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(status);
        expect(error.message).toContain(errorMessage);
      },
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/incidents/${incidentId}/generativeai/suggestions?locale=${locale}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status, statusText: 'Internal Server Error' });
  });
});
