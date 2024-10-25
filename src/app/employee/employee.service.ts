import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { throwError, of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ACCEPTED_ERRORS } from '../interceptors/error.interceptor';
import { NO_TOKEN } from '../interceptors/token.interceptor';
import { environment } from '../../environments/environment';

export class DuplicateEmailError extends Error {
  constructor(message?: string) {
    super(message ?? 'Email already registered.');
    this.name = 'DuplicateEmailError';
  }
}

export interface EmployeeResponse {
  id: string;
  clientId: string | null;
  name: string;
  email: string;
  role: string;
  invitationStatus: string;
  invitationDate: Date;
}

export interface IncidentListResponse {
  incidents: {
    name: string;
    user: {
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
export class EmployeeService {
  private readonly apiUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}

  register(employeeData: { name: string; email: string; password: string; role: string }) {
    const context = new HttpContext();
    context.set(ACCEPTED_ERRORS, [409]);
    context.set(NO_TOKEN, true);

    return this.http
      .post<EmployeeResponse>(`${this.apiUrl}/employees`, employeeData, { context: context })
      .pipe(
        map(response => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            return throwError(() => new DuplicateEmailError());
          }

          return throwError(() => error);
        }),
      );
  }

  loadIncidents(pageSize: number, page: number): Observable<IncidentListResponse | null> {
    return this.http
      .get<IncidentListResponse>(
        `${this.apiUrl}/employees/me/incidents?page_size=${pageSize}&page_number=${page}`,
      )
      .pipe(
        catchError(_ => {
          return of(null);
        }),
      );
  }
}
