import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DuplicateEmailError, EmployeeService } from '../employee.service';
import { AuthService } from '../../auth/auth.service';
import { defaultRoutes } from '../../auth/default.routes';
import { Role } from '../../auth/role';

@Component({
  selector: 'app-register',
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
  templateUrl: './employee-register.component.html',
  styleUrl: './employee-register.component.scss',
})
export class EmployeeRegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
  ) {}

  matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const passwordConfirmation = control.get('passwordConfirmation');

      const password_errors = password?.errors ?? {};
      const passwordConfirmation_errors = passwordConfirmation?.errors ?? {};

      if (password?.value !== passwordConfirmation?.value) {
        password_errors['passwordMismatch'] = true;
        passwordConfirmation_errors['passwordMismatch'] = true;
      } else {
        delete password_errors['passwordMismatch'];
        delete passwordConfirmation_errors['passwordMismatch'];
      }

      if (Object.keys(password_errors).length === 0) {
        password?.setErrors(null);
      } else {
        password?.setErrors(password_errors);
      }

      if (Object.keys(passwordConfirmation_errors).length === 0) {
        passwordConfirmation?.setErrors(null);
      } else {
        passwordConfirmation?.setErrors(passwordConfirmation_errors);
      }

      return null;
    };
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.maxLength(60)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
        role: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirmation: ['', [Validators.required]],
      },
      {
        validators: this.matchPasswordValidator(),
      },
    );
  }

  get name() {
    return this.registerForm.get('name')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get role() {
    return this.registerForm.get('role')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get passwordConfirmation() {
    return this.registerForm.get('passwordConfirmation')!;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password, role } = this.registerForm.value;

    this.employeeService.register({ name, email, password, role }).subscribe({
      next: _response => {
        this.authService.login(email, password).subscribe({
          next: success => {
            if (!success) {
              return;
            }

            this.snackbar.open(
              $localize`:@@employeeRegisterSuccess:Cuenta creada exitosamente`,
              $localize`:@@snackbarClose:Cerrar`,
              {
                duration: 10000,
              },
            );

            const userRole = this.authService.getRole();

            if (userRole !== null) {
              if (userRole === Role.Admin) {
                this.router.navigate(['/client/register']);
              } else {
                this.router.navigate([defaultRoutes[userRole]]);
              }
            }
          },
        });
      },
      error: error => {
        if (error instanceof DuplicateEmailError) {
          const errorMessage = $localize`:@@employeeRegisterErrorEmailRegistered:Ya existe un usuario con este email.`;

          this.snackbar.open(errorMessage, $localize`:@@snackbarClose:Cerrar`, {
            duration: 10000,
          });
        }
      },
    });
  }
}
