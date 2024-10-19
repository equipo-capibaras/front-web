import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-select-plan',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
  templateUrl: './select-plan.component.html',
  styleUrl: './select-plan.component.scss',
})
export class SelectPlanComponent {
  selectPlanForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  savePlan(planName: string, planPrice: number) {
    this.http
      .post<any>(`/api/v1//selectplan`, {
        name: planName,
        price: planPrice,
        date: new Date().toISOString(),
      })
      .pipe(
        map(response => {
          console.log('Company Registration successful:', response);

          this.router.navigate(['/']);
        }),
        catchError(error => {
          this.router.navigate(['/']);
          console.error('Error save plan:', error); // Other errors
          alert('Error save plan');
          return of(false);
        }),
      )
      .subscribe(success => {
        if (!success) {
          return;
        }
      });
  }
}
