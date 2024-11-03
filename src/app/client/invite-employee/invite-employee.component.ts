import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { InviteEmployeeDialogComponent } from '../invite-employee-dialog/invite-employee-dialog.component';
import { InviteConfirmDialogComponent } from '../invite-confirm-dialog/invite-confirm-dialog.component';
import {
  ClientService,
  DuplicateEmployeeExistError,
  EmployeeNotFoundError,
} from '../client.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invite-employee',
  standalone: true,
  templateUrl: './invite-employee.component.html',
  imports: [MatButtonModule],
})
export class InviteEmployeeComponent {
  constructor(
    private readonly dialog: MatDialog,
    private readonly clientService: ClientService,
    private readonly snackbarService: SnackbarService,
    private readonly router: Router,
  ) {}

  openInviteDialog(): void {
    const inviteDialogRef = this.dialog.open(InviteEmployeeDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
    });

    inviteDialogRef.afterClosed().subscribe(email => {
      if (!email) return;

      this.clientService.getEmployeeByEmail(email).subscribe({
        next: employee => {
          this.confirmInvite(email, employee.role);
        },
        error: error => {
          if (error instanceof EmployeeNotFoundError) {
            this.snackbarService.showError(
              $localize`:@@invitationEmployeeNotFound:No se encontró el empleado.`,
            );
          }
        },
      });
    });
  }

  confirmInvite(email: string, role: string): void {
    const confirmDialogRef = this.dialog.open(InviteConfirmDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        username: email,
        role: role,
      },
    });

    confirmDialogRef.afterClosed().subscribe(response => {
      if (!response) return;

      this.clientService.inviteUser(email).subscribe({
        next: () => {
          this.snackbarService.showSuccess(
            $localize`:@@invitationEmployeeSuccess:Empleado invitado exitosamente.`,
          );
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/admin']);
          });
        },
        error: error => {
          if (error instanceof DuplicateEmployeeExistError) {
            this.snackbarService.showError(
              $localize`:@@invitationEmployeeDuplicate:Empleado ya vinculado a tu empresa.`,
            );
          }
          if (error instanceof EmployeeNotFoundError) {
            this.snackbarService.showError(
              $localize`:@@invitationEmployeeNotFound:No se encontró el empleado.`,
            );
          }
        },
      });
    });
  }
}
