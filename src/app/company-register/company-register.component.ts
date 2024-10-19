import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-company-register',
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
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.scss'], // Corrected styleUrls
})
export class CompanyRegisterComponent implements OnInit {
  createAccountForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.createAccountForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.maxLength(60)]],
    });
  }

  get name() {
    return this.createAccountForm.get('name')!;
  }

  get email() {
    return this.createAccountForm.get('email')!;
  }

  registerCompany(): void {
    if (this.createAccountForm.invalid) {
      this.createAccountForm.markAllAsTouched();
      return;
    }

    const { name } = this.createAccountForm.value;
    const email = `${this.createAccountForm.get('email')!.value}@capibaras.io`;

    this.http
      .post<any>(`/api/v1//company`, { name, email })
      .pipe(
        map(response => {
          console.log('Company Registration successful:', response);

          this.router.navigate(['/select-plan']);
        }),
        catchError(error => {
          this.router.navigate(['/select-plan']);

          // Check if it's a 409 conflict error and display a custom message
          if (error.status === 409 && error.error.message === 'Email already registered') {
            console.error('Error:', error.error.message); // "Email already registered"
            alert('This email is already registered. Please use a different email.');
          } else {
            console.error('Company Registration failed:', error); // Other errors
            alert('Company Registration failed. Please try again.');
          }
          return of(false);
        }),
      )
      .subscribe(success => {
        if (!success) {
          return;
        }
      });
  }
}
