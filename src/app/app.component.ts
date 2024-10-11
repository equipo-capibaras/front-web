import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth/auth.service';
import { Role } from './auth/role';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  userRole: Role | null = null;
  private roleSubscription!: Subscription;

  constructor(private authService: AuthService) {
    this.roleSubscription = this.authService.userRole$.subscribe((role: Role | null) => {
      this.userRole = role;
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated(); // Verifica si el usuario está autenticado
  }
}
