import { Injectable } from '@angular/core';
import { Invoice } from './invoice-detail/invoice';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InoviceService {
  private readonly apiUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}

  invoiceDetail(): Observable<Invoice | null> {
    return this.http.get<Invoice>(`${this.apiUrl}/Invoices/`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
