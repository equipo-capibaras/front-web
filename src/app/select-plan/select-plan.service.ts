import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SelectPlanService {
  constructor(private readonly http: HttpClient) {}

  savePlan(planName: string) {
    const token = localStorage.getItem('token');
    console.log('token', token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(`/api/v1/clients/me/plan/${planName}`, {}, { headers }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        alert('Error saving plan. Please try again.');
        return of(false);
      }),
    );
  }
}
