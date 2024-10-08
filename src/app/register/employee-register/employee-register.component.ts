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
  selector: 'app-login',
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
  errorName: string = '';
  errorEmail: string = '';
  errorPassword: string = '';
  errorConfirmPassword: string = '';

  helper = new JwtHelperService();

  constructor(
    private registerService: RegisterService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  CreateAccount(
    AccountName: string,
    email: string,
    password: string,
    ConfirmPassword: string,
  ): void {
    // Validar que los campos no estén vacíos y mostrar mensajes de error correspondientes
    this.errorName = !AccountName ? $localize`:@@campo-obligatorio:Este campo es obligatorio` : '';

    this.errorPassword = !password ? $localize`:@@campo-obligatorio:Este campo es obligatorio` : '';
    this.errorConfirmPassword = !ConfirmPassword
      ? $localize`:@@campo-obligatorio:Este campo es obligatorio`
      : '';

    this.errorEmail = !email ? $localize`:@@campo-obligatorio:Este campo es obligatorio` : '';

    // Si hay algún error, detener la ejecución
    if (!AccountName || !password || !email) {
      return;
    }
  }
}
