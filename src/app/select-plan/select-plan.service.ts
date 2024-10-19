import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SelectPlanService {
  constructor(private readonly http: HttpClient) {}

  savePlan(planData: { name: string; price: number; date: string }) {
    return this.http.post<any>(`/api/v1/selectplan`, planData).pipe(
      map(response => {
        console.log('Plan selection successful:', response);
        return response; // Return the response for further processing if needed
      }),
      catchError(error => {
        console.error('Error saving plan:', error); // Handle error
        alert('Error saving plan. Please try again.');
        return of(false); // Return an observable of false to indicate failure
      }),
    );
  }
}
