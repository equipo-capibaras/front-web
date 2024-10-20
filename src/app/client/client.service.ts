import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ACCEPTED_ERRORS } from '../interceptors/error.interceptor';
import { Client } from './client';
import { environment } from 'src/environments/environment';
import { EmployeeListResponse } from './employee-list/employee-list';

export class DuplicateEmailError extends Error {
  constructor(message?: string) {
    super(message ?? 'Email already registered.');
    this.name = 'DuplicateEmailError';
  }
}

export interface ClientResponse {
  id: string;
  name: string;
  emailIncidents: string;
  plan: string | null;
}
@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly apiUrl = environment.apiUrl;
  private readonly clientDataSubject = new BehaviorSubject<Client | null>(null);
  public clientData$ = this.clientDataSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  register(clientData: { name: string; prefixEmailIncidents: string }) {
    const context = new HttpContext().set(ACCEPTED_ERRORS, [409]);

    return this.http.post<ClientResponse>(`/api/v1/clients`, clientData, { context: context }).pipe(
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

  savePlan(planName: string) {
    return this.http.post<ClientResponse>(`/api/v1/clients/me/plan/${planName}`, {}).pipe(
      map(() => {
        return true;
      }),
      catchError(() => {
        return of(false);
      }),
    );
  }

  loadClientData(): Observable<Client | null> {
    return this.http.get<Client>(`${this.apiUrl}/clients/me`).pipe(
      catchError(_ => {
        return of(null);
      }),
    );
  }

  loadClientEmployees(pageSize: number, page: number): Observable<EmployeeListResponse | null> {
    return this.http
      .get<EmployeeListResponse>(
        `${this.apiUrl}/employees?page_size=${pageSize}&page_number=${page}`,
      )
      .pipe(
        catchError(_ => {
          return of(null);
        }),
      );
  }
}
