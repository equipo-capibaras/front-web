import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
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

export interface IncidentResponse {
  client_id: string;
  name: string;
  channel: string;
  reported_by: string;
  created_by: string;
  description: string;
}

export class ErrorIncidentError extends Error {
  constructor(message?: string) {
    super(message ?? 'Error Create.');
    this.name = 'ErrorIncidentError';
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

  incidentRegister(incidentData: { name: string; email: string; description: string }) {
    const context = new HttpContext();
    context.set(ACCEPTED_ERRORS, [409]);

    return this.http
      .post<IncidentResponse>(`${this.apiUrl}/incidents/web`, incidentData, { context: context })
      .pipe(
        map(response => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            return throwError(() => new ErrorIncidentError());
          }

          return throwError(() => error);
        }),
      );
  }
}
