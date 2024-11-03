import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from '../../services/snackbar.service';
import { IncidentService, UserNotFoundError } from '../incident.service';

@Component({
  selector: 'app-incident-register',
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
  ],
  templateUrl: './incident-register.component.html',
  styleUrl: './incident-register.component.scss',
})
export class IncidentRegisterComponent implements OnInit {
  incidenteForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly snackbarService: SnackbarService,
    private readonly incidentService: IncidentService,
  ) {}

  ngOnInit(): void {
    this.incidenteForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get name() {
    return this.incidenteForm.get('name')!;
  }

  get email() {
    return this.incidenteForm.get('email')!;
  }

  get description() {
    return this.incidenteForm.get('description')!;
  }

  onSubmit() {
    if (this.incidenteForm.invalid) {
      this.incidenteForm.markAllAsTouched();
      return;
    }

    const name = this.name.value;
    const email = this.email.value;
    const description = this.description.value;

    this.incidentService.registerIncident({ name, email, description }).subscribe({
      next: _response => {
        this.snackbarService.showSuccess(
          $localize`:@@createIncidentSuccess:Incidente creado exitosamente`,
        );
        this.router.navigate(['/incidents']);
      },
      error: error => {
        if (error instanceof UserNotFoundError) {
          this.snackbarService.showError($localize`:@@UserNotFoundError:Usuario no encontrado.`);
        }
      },
    });
  }
}
