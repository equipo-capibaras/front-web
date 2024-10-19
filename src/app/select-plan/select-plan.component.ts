import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { SelectPlanService } from './select-plan.service'; // Import the SelectPlanService

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
  styleUrls: ['./select-plan.component.scss'], // Corrected styleUrls
})
export class SelectPlanComponent {
  selectPlanForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly selectPlanService: SelectPlanService, // Inject the SelectPlanService
  ) {}

  savePlan(planName: string, planPrice: number) {
    const planData = {
      name: planName,
      price: planPrice,
      date: new Date().toISOString(),
    };

    this.selectPlanService.savePlan(planData).subscribe(success => {
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/']); // Navigate on failure as well
      }
    });
  }
}
