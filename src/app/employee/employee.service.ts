import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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

  loadEmployeeData(): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(`${this.apiUrl}/employees/me`);
  }
}
