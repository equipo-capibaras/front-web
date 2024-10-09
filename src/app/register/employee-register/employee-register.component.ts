import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-employee-register',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
  ],
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss'],
})
export class EmployeeRegisterComponent implements OnInit {
  errorName = '';
  errorEmail = '';
  errorPassword = '';
  errorConfirmPassword = '';

  helper = new JwtHelperService();

  constructor(
    private registerService: RegisterService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Initialization logic can be added here if needed
    console.log('EmployeeRegisterComponent initialized');
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }

  CreateAccount(
    name: string,
    email: string,
    role: string,
    password: string,
    ConfirmPassword: string,
  ): void {
    this.clearErrors();

    // Field validations
    if (!name) {
      this.errorName = 'Este campo es obligatorio';
    }
    if (!email) {
      this.errorEmail = 'Este campo es obligatorio';
    } else if (!this.validateEmail(email)) {
      this.errorEmail = 'El formato del correo electrónico no es válido';
    }

    if (!password) {
      this.errorPassword = 'Este campo es obligatorio';
    }
    if (password !== ConfirmPassword) {
      this.errorConfirmPassword = 'Las contraseñas no coinciden';
    }

    if (this.errorName || this.errorEmail || this.errorPassword || this.errorConfirmPassword) {
      return;
    }

    // Default role to admin
    role = 'admin';

    // Call the register service to create the account
    this.registerService.CreateAccount(name, email, role, password).subscribe(
      () => {
        // On successful registration, redirect to plan selection page
        this.router.navigate(['/select-plan']);
      },
      error => {
        if (error.status === 400) {
          this.errorEmail = 'El correo electrónico ya está registrado';
        } else {
          alert('Error al registrar la empresa');
        }
      },
    );
  }

  clearErrors() {
    this.errorName = '';
    this.errorEmail = '';
    this.errorPassword = '';
    this.errorConfirmPassword = '';
  }
}
