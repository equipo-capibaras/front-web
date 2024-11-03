import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
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

export class EmployeeNoFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Employee not found');
    this.name = 'EmployeeNoFoundError';
  }
}

export class InvitationAlreadyAcceptedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Invitation already accepted');
    this.name = 'InvitationAlreadyAcceptedError';
  }
}

export class InvitationNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Invitation not found');
    this.name = 'InvitationNotFoundError';
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

export enum InvitationResponse {
  Accept = 'accepted',
  Decline = 'declined',
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
        catchError(err => {
          return throwError(() => err);
        }),
      );
  }

  getRoleByEmail(email: string): Observable<Employee> {
    const context = new HttpContext().set(ACCEPTED_ERRORS, [404]);

    return this.http
      .post<Employee>(`${this.apiUrl}/employees/detail`, { email }, { context: context })
      .pipe(
        map(employeeData => employeeData),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return throwError(() => new EmployeeNoFoundError());
          }
          return throwError(() => error);
        }),
      );
  }

  inviteUser(email: string) {
    const context = new HttpContext().set(ACCEPTED_ERRORS, [409]);

    return this.http
      .post<ClientResponse>(`${this.apiUrl}/employees/invite`, { email }, { context: context })
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

  respondInvitation(response: InvitationResponse) {
    const context = new HttpContext().set(ACCEPTED_ERRORS, [404, 409]);

    return this.http
      .post<void>(`${this.apiUrl}/employees/invitation`, { response }, { context: context })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            return throwError(() => new InvitationAlreadyAcceptedError());
          } else if (error.status === 404) {
            return throwError(() => new InvitationNotFoundError());
          }

          return throwError(() => error);
        }),
      );
  }
}
