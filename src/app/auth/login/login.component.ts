import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { defaultRoutes } from 'src/app/app.routes';

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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getRole();
      if (role !== null) {
        this.router.navigate([defaultRoutes[role]]);
      }
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.username.value, this.password.value).subscribe(success => {
      if (!success) {
        return;
      }

      const role = this.authService.getRole();
      if (role !== null) {
        this.router.navigate([defaultRoutes[role]]);
      }
    });
  }
}
