import { EmployeeResponse, EmployeeService } from './../employee.service';
import { ClientService } from './../../client/client.service';
import { Component, OnInit } from '@angular/core';
import { InvitationDialogComponent } from '../invite-message/invite-message.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, Invitation } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { defaultRoutes } from 'src/app/auth/default.routes';

@Component({
  selector: 'app-employee-unassigned',
  standalone: true,
  imports: [],
  templateUrl: './employee-unassigned.component.html',
  styleUrls: ['./employee-unassigned.component.scss'], // Corrige `styleUrl` a `styleUrls`
})
export class EmployeeUnassignedComponent implements OnInit {
  invitation: Invitation | null = null;

  constructor(
    private readonly dialog: MatDialog,
    private readonly clientService: ClientService,
    private readonly employeeService: EmployeeService,

    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.getStatusInvitation().then(status => {
      if (status) {
        this.openPopup();
      }
    });
  }

  openPopup(): void {
    const dialogRef = this.dialog.open(InvitationDialogComponent);

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
    const token = this.authService.getToken();

    if (token) {
      this.clientService.acceptInvitation(token).subscribe({
        next: () => {
          this.invitation = null;
          console.log('Invitation accepted.');

          this.authService.refreshToken().subscribe({
            next: () => {
              const role = this.authService.getRole();
              if (role != null) {
                this.router.navigate([defaultRoutes[role]]);
              }
            },
            error: err => {
              console.error('Error refreshing token:', err);
            },
          });
        },
        error: err => {
          console.log(err.status);
          if (err.status === 409) {
            console.error('Ya estás vinculado a la organización:', err.message);
          } else {
            console.error('Error al aceptar la invitación:', err);
          }
        },
      });
    }
  }

  declineInvitation() {
    console.log('Declining invitation...');
    const token = this.authService.getToken();
    if (token) {
      this.clientService.declineInvitation(token).subscribe({
        next: () => {
          this.invitation = null;
          console.log('Invitation declined.');
        },
        error: err => {
          console.error('Error al rechazar la invitación:', err);
        },
      });
    } else {
      console.error('Error: Token is null');
    }
  }
  async getStatusInvitation(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.employeeService.validateStatusInvitation().subscribe({
        next: (data: EmployeeResponse | null) => {
          resolve(data ? data.invitationStatus === 'pending' : false);
        },
        error: () => resolve(false),
      });
    });
  }
}
