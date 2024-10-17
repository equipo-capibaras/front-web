import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth/auth.service';
import { Role } from './auth/role';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  userRole: Role | null = null;

  constructor(private readonly authService: AuthService) {
    this.authService.userRole$.subscribe((role: Role | null) => {
      this.userRole = role;
    });
  }
}
