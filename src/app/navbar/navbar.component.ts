import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, Invitation } from './../auth/auth.service';
import { Role } from './../auth/role';
import { InvitationDialogComponent } from '../employee/invite-message/invite-message.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  Role = Role;
  userRole: Role | null = null;
  showNavbar = false;
  invitation: Invitation | null = null;
  private readonly roleSubscription!: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private dialog: MatDialog,
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

  ngOnInit() {
    this.checkPendingInvitation();
  }

  ngOnDestroy() {
    this.roleSubscription.unsubscribe(); // Clean up subscription
  }

  checkPendingInvitation() {
    const userId = this.authService.getToken();
    if (userId) {
      this.authService.checkPendingInvitation(userId).subscribe(invitation => {
        if (invitation?.invitationStatus === 'pending') {
          this.openInvitationDialog(invitation);
        } else {
          console.log('No pending invitation found.');
        }
      });
    }
  }

  openInvitationDialog(invitation: Invitation) {
    const dialogRef = this.dialog.open(InvitationDialogComponent, {
      data: invitation,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'accepted') {
        this.acceptInvitation();
      } else if (result === 'declined') {
        this.declineInvitation();
      }
    });
  }

  acceptInvitation() {
    console.log('Accepting invitation...');
    this.authService.acceptInvitation().subscribe({
      next: () => {
        this.invitation = null;
        console.log('Invitation accepted.');
      },
      error: err => {
        console.error('Error accepting invitation:', err);
      },
    });
  }
  declineInvitation() {
    console.log('Declining invitation...');
    this.authService.declineInvitation().subscribe({
      next: () => {
        this.invitation = null;
        console.log('Invitation declined.');
      },
      error: err => {
        console.error('Error declining invitation:', err);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
