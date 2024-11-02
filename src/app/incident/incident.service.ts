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
  id: string;
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

  changeStatusIncident(IncidentStatusData: {
    status: string;
    comment: string;
  }): Observable<IncidentResponse> {
    const context = new HttpContext().set(ACCEPTED_ERRORS, [409]);
    return this.http
      .post<IncidentResponse>(`${this.apiUrl}/incident/changestatus`, IncidentStatusData, {
        context: context,
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            return throwError(() => new Error());
          }

          return throwError(() => error);
        }),
      );
  }
}
