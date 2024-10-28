import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './invite-message.component.html',
  styleUrls: ['./invite-message.component.scss'],
})
export class InvitationDialogComponent {
  constructor(private dialogRef: MatDialogRef<InvitationDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close('accepted');
  }

  onDecline(): void {
    this.dialogRef.close('declined');
  }
}
