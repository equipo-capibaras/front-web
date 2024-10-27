import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ACCEPTED_ERRORS } from '../interceptors/error.interceptor';
import { Client } from './client';
import { environment } from '../../environments/environment';
import { EmployeeListResponse } from './employee-list/employee-list';

export class DuplicateEmailError extends Error {
  constructor(message?: string) {
    super(message ?? 'Email already registered.');
    this.name = 'DuplicateEmailError';
  }
}

export class DuplicateEmployeeExistError extends Error {
  constructor(message?: string) {
    super(message ?? 'Employee already linked to your company.');
    this.name = 'DuplicateEmployeeExistError';
  }
}

export interface Employee {
  id: string;
  clientId: string;
  name: string;
  email: string;
  role: string;
  invitationStatus: string;
  invitationDate: string;
}

export interface ClientInviteUserResponse {
  message: string;
  employee: Employee;
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

  private mockEmployee: Employee = {
    id: '1dabcf78-e62a-41fd-b69c-fd7c775b04d4',
    clientId: '22128c04-0c2c-4633-8317-0fffd552f7a6',
    name: 'Mariana Sanchez Torres',
    email: 'agente@gmail.com',
    role: 'analyst',
    invitationStatus: 'accepted',
    invitationDate: '2024-10-12T16:32:48+00:00',
  };

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

  loadClientData(forceUpdate = false): Observable<Client | null> {
    const currentClientData = this.clientDataSubject.getValue();

    if (currentClientData && !forceUpdate) {
      return of(currentClientData);
    }

    return this.http.get<Client>(`${this.apiUrl}/clients/me`).pipe(
      map(clientData => {
        this.clientDataSubject.next(clientData);
        return clientData;
      }),
      catchError(err => {
        return throwError(() => err);
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

  inviteUser(email: string) {
    const emailSend = { email };
    const context = new HttpContext().set(ACCEPTED_ERRORS, [409]);

    return this.http
      .post<ClientResponse>(`/employees/invite`, emailSend, { context: context })
      .pipe(
        map(response => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            return throwError(() => new DuplicateEmployeeExistError());
          }

          return throwError(() => error);
        }),
      );
  }
  getRoleByEmail(email: string): Observable<Employee> {
    // Simulate the behavior of the API call with mock data
    if (email === this.mockEmployee.email) {
      return of(this.mockEmployee); // Return mock employee data
    }
    return throwError(() => new HttpErrorResponse({ error: 'User not found', status: 404 }));
  }
}
