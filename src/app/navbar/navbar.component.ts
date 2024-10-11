import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Role } from './../auth/role';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
})
export class NavbarComponent implements OnDestroy {
  userRole: Role | null = null;
  private roleSubscription!: Subscription;

  constructor(private authService: AuthService) {
    this.roleSubscription = this.authService.userRole$.subscribe((role: Role | null) => {
      this.userRole = role;
    });
  }

  ngOnDestroy() {
    this.roleSubscription.unsubscribe(); // Clean up subscription
  }

  isAdmin(): boolean {
    return this.userRole === Role.Admin;
  }

  isAgent(): boolean {
    return this.userRole === Role.Agent;
  }

  isAnalyst(): boolean {
    return this.userRole === Role.Analyst;
  }

  logout() {
    this.authService.logout();
  }
}
