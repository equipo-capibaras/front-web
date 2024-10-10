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
  genericErrorUsername = '';
  showUsernameError = false;
  showPasswordError = false;
  helper = new JwtHelperService();
  loginForm!: FormGroup;

  constructor(
    private readonly userService: UserServiceService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('userId', '');

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.updateErrors();
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

  // Actualiza los mensajes de error en la vista
  updateErrors(): void {
    const usernameControl = this.loginForm.get('username');
    if (usernameControl?.hasError('required') && usernameControl.touched) {
      this.genericErrorUsername = this.errorUsername;
      this.showUsernameError = true;
    } else if (usernameControl?.hasError('email')) {
      this.genericErrorUsername = this.errorUsernameType;
      this.showUsernameError = true;
    } else {
      this.showUsernameError = false;
    }

    const passwordControl = this.loginForm.get('password');
    this.showPasswordError = passwordControl
      ? passwordControl.hasError('required') && passwordControl.touched
      : false;
  }
}
