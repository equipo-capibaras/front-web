// invitation-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invitation-dialog',
  template: `
    <h1 class="Texth2" i18n>Invitacion de la compañia {{ data.name }}</h1>
    <p i18n>Role: {{ data.role }}</p>
    <button mat-button data-testid="accept-button" (click)="onAccept()">Accept</button>
    <button mat-button data-testid="decline-button" (click)="onDecline()">Decline</button>
  `,
})
export class InvitationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InvitationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onAccept(): void {
    this.dialogRef.close('accepted');
  }

  onDecline(): void {
    this.dialogRef.close('declined');
  }
}
