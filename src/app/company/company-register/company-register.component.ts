import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { CompanyRegisterService } from '../company-register.service';

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
    private readonly companyRegisterService: CompanyRegisterService, // Inject the CompanyRegisterService
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

    this.companyRegisterService.registerCompany({ name, email }).subscribe(success => {
      if (success) {
        this.router.navigate(['/select-plan']);
      }

      this.router.navigate(['/select-plan']);
    });
  }
}
