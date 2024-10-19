import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CompanyRegisterService {
  constructor(private readonly http: HttpClient) {}

  registerCompany(companyData: { name: string; email: string }) {
    return this.http.post<any>(`/api/v1/company`, companyData).pipe(
      map(response => {
        console.log('Company Registration successful:', response);
        return response;
      }),
      catchError(error => {
        // Handle the error here
        if (error.status === 409 && error.error.message === 'Email already registered') {
          console.error('Error:', error.error.message);
          alert('This email is already registered. Please use a different email.');
        } else {
          console.error('Company Registration failed:', error);
          alert('Company Registration failed. Please try again.');
        }
        return of(false);
      }),
    );
  }
}
