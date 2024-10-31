import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Incident } from './incident';

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
}
