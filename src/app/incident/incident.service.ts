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
    risk?: string;
  }[];
  totalPages: number;
  currentPage: number;
  totalIncidents: number;
}

export interface IncidentResponse {
  client_id: string;
  name: string;
  channel: string;
  reported_by: string;
  created_by: string;
  description: string;
}

export interface HistoryResponse {
  seq: number;
  date: string;
  action: string;
  description: string;
}

export interface Suggestion {
  text: string;
  detail: string;
}

export interface SuggestionsAI {
  steps: Suggestion[];
}

export class UserNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'User not found.');
    this.name = 'UserNotFoundError';
  }
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

  registerIncident(incidentData: { name: string; email: string; description: string }) {
    const context = new HttpContext();
    context.set(ACCEPTED_ERRORS, [404]);

    return this.http
      .post<IncidentResponse>(`${this.apiUrl}/incidents/web`, incidentData, { context: context })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return throwError(() => new UserNotFoundError());
          }

          return throwError(() => error);
        }),
      );
  }

  AISuggestions(incidentId: string, locale: string): Observable<SuggestionsAI | null> {
    return this.http
      .get<SuggestionsAI>(
        `${this.apiUrl}/incidents/${incidentId}/generativeai/suggestions?locale=${locale}`,
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }
}
