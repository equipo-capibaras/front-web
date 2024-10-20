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
import { ClientService } from '../client.service';
import { AuthService } from '../../auth/auth.service';
import { defaultRoutes } from '../../auth/default.routes';

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
  styleUrls: ['./select-plan.component.scss'],
})
export class SelectPlanComponent {
  selectPlanForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
  ) {}

  savePlan(planName: string) {
    this.clientService.savePlan(planName).subscribe(success => {
      if (success) {
        const role = this.authService.getRole();
        if (role !== null) {
          this.router.navigate([defaultRoutes[role]]);
        }
      }
    });
  }
}
