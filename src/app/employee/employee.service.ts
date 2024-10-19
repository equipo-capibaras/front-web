import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private readonly http: HttpClient) {}

  registerEmployee(employeeData: { name: string; email: string; password: string; role: string }) {
    return this.http.post<any>(`/api/v1/employees`, employeeData).pipe(
      map(response => {
        console.log('Registration successful:', response);
        localStorage.setItem('employeeId', response.id);
        return response;
      }),
      catchError(error => {
        // Check if it's a 409 conflict error and handle it
        if (error.error.message === 'Email already registered') {
          console.error('Error:', error.error.message);
          alert('This email is already registered. Please use a different email.');
        } else {
          console.error('Registration failed:', error); // Handle other errors
          alert('Registration failed. Please try again.');
        }
        return of(false);
      }),
    );
  }
}
