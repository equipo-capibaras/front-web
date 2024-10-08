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
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.scss'],
})
export class CompanyRegisterComponent implements OnInit {
  errorName: string = '';
  errorEmail: string = '';

  helper = new JwtHelperService();

  constructor(
    private registerService: RegisterService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  CreateAccountAccess(AccountName: string, email: string): void {
    this.errorName = !AccountName ? $localize`:@@campo-obligatorio:Este campo es obligatorio` : '';
    this.errorEmail = !email ? $localize`:@@campo-obligatorio:Este campo es obligatorio` : '';

    if (!AccountName || !email) {
      return;
    }
  }
}
