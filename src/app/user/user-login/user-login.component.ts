import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  showPassword = false;
  error: string = '';
  helper = new JwtHelperService();

  constructor(
    private userService: UserServiceService,
    private router: Router,
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

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
