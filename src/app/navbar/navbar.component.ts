import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './../auth/auth.service';
import { Role } from './../auth/role';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
})
export class NavbarComponent implements OnDestroy {
  Role = Role;
  userRole: Role | null = null;
  private roleSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.roleSubscription = this.authService.userRole$.subscribe((role: Role | null) => {
      this.userRole = role;
    });
  }

  ngOnDestroy() {
    this.roleSubscription.unsubscribe(); // Clean up subscription
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
