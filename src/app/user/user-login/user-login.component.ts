import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserServiceService } from '../user-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  errorUsername = $localize`:@@campo-obligatorio:Este campo es obligatorio`;
  errorUsernameType = $localize`:@@usuario-invalido:Debe ser un correo electrónico válido`;
  errorPassword = $localize`:@@campo-obligatorio:Este campo es obligatorio`;
  helper = new JwtHelperService();
  loginForm!: FormGroup;

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private formBuilder: FormBuilder,
    //private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('userId', '');

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  loginUser(username: string, password: string): void {
    // Si hay algún error, detener la ejecución
    if (!username || !password) {
      return;
    }

    // Proceder con el login si no hay errores
    this.userService.login(username, password).subscribe(response => {
      sessionStorage.setItem('token', response.token);
      const decodedToken = this.helper.decodeToken(response.token);
      sessionStorage.setItem('userId', decodedToken.id);
      this.router.navigate(['/alarms']);
    });
  }

  // Validación de errores para el campo 'username'
  shouldShowUsernameRequiredError(): boolean {
    const control = this.loginForm.get('username');
    return (control?.hasError('required') ?? false) && (control?.touched ?? false);
  }

  shouldShowUsernameEmailError(): boolean {
    const control = this.loginForm.get('username');
    return (control?.hasError('email') ?? false) && (control?.touched ?? false);
  }

  // Validación de errores para el campo 'password'
  shouldShowPasswordRequiredError(): boolean {
    const control = this.loginForm.get('password');
    return (control?.hasError('required') ?? false) && (control?.touched ?? false);
  }
}
