import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserServiceService } from '../user-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  error: string = '';
  helper = new JwtHelperService();

  constructor(
    private userService: UserServiceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('userId', '');
  }

  loginUser(username: string, password: string): void {
    this.userService.login(username, password).subscribe(
      response => {
        sessionStorage.setItem('token', response.token);
        const decodedToken = this.helper.decodeToken(response.token);
        sessionStorage.setItem('userId', decodedToken.id);
        this.router.navigate(['/alarms']);
      },
      error => {
        this.error = error.message;
      },
    );
  }
}
