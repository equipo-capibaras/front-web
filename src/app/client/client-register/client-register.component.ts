import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ClientService, DuplicateEmailError } from '../client.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-client-register',
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
  templateUrl: './client-register.component.html',
  styleUrl: './client-register.component.scss',
})
export class ClientRegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.maxLength(60)]],
    });
  }

  get name() {
    return this.registerForm.get('name')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const name = this.name.value;
    const prefixEmailIncidents = this.email.value;

    this.clientService.register({ name, prefixEmailIncidents }).subscribe({
      next: _response => {
        this.snackbarService.showSuccess(
          $localize`:@@clientRegisterSuccess:Empresa creada exitosamente`,
        );
        this.authService.refreshToken().subscribe({
          next: () => {
            this.router.navigate(['/client/select-plan']);
          },
        });
      },
      error: error => {
        if (error instanceof DuplicateEmailError) {
          this.snackbarService.showError(
            $localize`:@@clientRegisterErrorEmailRegistered:Ya existe una empresa con este email.`,
          );
        }
      },
    });
  }
}
