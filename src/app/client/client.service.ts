import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ACCEPTED_ERRORS } from '../interceptors/error.interceptor';

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
}
