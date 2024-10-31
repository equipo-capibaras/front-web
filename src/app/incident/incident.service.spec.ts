import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IncidentService, IncidentListResponse } from './incident.service';
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
});
