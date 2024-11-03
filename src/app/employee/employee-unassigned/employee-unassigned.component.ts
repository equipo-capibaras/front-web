import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvitationDialogComponent } from '../invite-message/invite-message.component';
import { AuthService } from '../../auth/auth.service';
import { EmployeeService } from './../employee.service';
import {
  ClientService,
  InvitationAlreadyAcceptedError,
  InvitationNotFoundError,
  InvitationResponse,
} from './../../client/client.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-employee-unassigned',
  standalone: true,
  imports: [],
  templateUrl: './employee-unassigned.component.html',
  styleUrl: './employee-unassigned.component.scss',
})
export class EmployeeUnassignedComponent implements OnInit {
  constructor(
    private readonly dialog: MatDialog,
    private readonly clientService: ClientService,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.employeeService.loadEmployeeData().subscribe({
      next: data => {
        console.log(data);
        if (data.invitationStatus == 'pending') {
          this.openPopup();
        }
      },
    });
  }

  openPopup(): void {
    const dialogRef = this.dialog.open(InvitationDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      let response: InvitationResponse;
      if (result === 'accepted') {
        response = InvitationResponse.Accept;
      } else {
        response = InvitationResponse.Decline;
      }

      this.respondToInvitation(response);
    });
  }

  respondToInvitation(response: InvitationResponse) {
    this.clientService.respondInvitation(response).subscribe({
      next: () => {
        if (response == InvitationResponse.Accept) {
          this.snackbarService.showSuccess($localize`:@@invitationAccepted:Invitación aceptada.`);
        } else {
          this.snackbarService.showSuccess($localize`:@@invitationDeclined:Invitación rechazada.`);
        }

        this.authService.refreshToken(response == InvitationResponse.Accept).subscribe({});
      },
      error: error => {
        if (error instanceof InvitationAlreadyAcceptedError) {
          this.snackbarService.showError(
            $localize`:@@invitationAlreadyAccepted:Invitación ya aceptada.`,
          );

          this.authService.refreshToken(true).subscribe({});
        } else if (error instanceof InvitationNotFoundError) {
          this.snackbarService.showError(
            $localize`:@@invitationNotFound:Invitación no encontrada.`,
          );
        }
      },
    });
  }
}
