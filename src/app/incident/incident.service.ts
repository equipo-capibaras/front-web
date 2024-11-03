import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Incident } from './incident';
import { ACCEPTED_ERRORS } from '../interceptors/error.interceptor';

export interface IncidentListResponse {
  incidents: {
    id: string;
    name: string;
    reportedBy: {
      id: string;
      name: string;
      email: string;
    };
    filingDate: Date;
    status: string;
  }[];
  totalPages: number;
  currentPage: number;
  totalIncidents: number;
}

export interface HistoryResponse {
  seq: number;
  date: string;
  action: string;
  description: string;
}

export class IncidentClosedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Incident already closed.');
    this.name = 'IncidentClosedError';
  }
}

export class IncidentNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Incident not found.');
    this.name = 'IncidentNotFoundError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly apiUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}

  loadIncidents(pageSize: number, page: number): Observable<IncidentListResponse | null> {
    return this.http
      .get<IncidentListResponse>(
        `${this.apiUrl}/employees/me/incidents?page_size=${pageSize}&page_number=${page}`,
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }

  incidentDetail(incidentId: string): Observable<Incident | null> {
    return this.http.get<Incident>(`${this.apiUrl}/incidents/${incidentId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }

  changeStatusIncident(status: string, description: string, incident_id: string) {
    const context = new HttpContext().set(ACCEPTED_ERRORS, [404, 409]);

    const incidentStatusData = {
      action: status,
      description: description,
    };

    return this.http
      .post<HistoryResponse>(`${this.apiUrl}/incidents/${incident_id}/update`, incidentStatusData, {
        context: context,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            return throwError(() => new IncidentClosedError());
          } else if (error.status === 404) {
            return throwError(() => new IncidentNotFoundError());
          }

          return throwError(() => error);
        }),
      );
  }
}
