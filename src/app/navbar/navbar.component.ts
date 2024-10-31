import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router, RouterLink } from '@angular/router';
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
  showNavbar = false;
  private readonly roleSubscription!: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.router.events.subscribe(data => {
      if (data instanceof ActivationEnd) {
        this.showNavbar = data.snapshot.data['showNavbar'];
      }
    });

    this.roleSubscription = this.authService.userRole$.subscribe((role: Role | null) => {
      this.userRole = role;
    });
  }

  ngOnDestroy() {
    this.roleSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
