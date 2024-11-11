import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invoice } from './invoice-detail/invoice';

@Injectable({
  providedIn: 'root',
})
export class InoviceService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  invoiceDetail(): Observable<Invoice | null> {
    return this.http.get<Invoice>(`${this.apiUrl}/invoice`).pipe(
      catchError((_error: HttpErrorResponse) => {
        return throwError(() => new Error('Error loading invoice details'));
      }),
    );
  }
}
