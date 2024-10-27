// invitation-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invitation-dialog',
  template: `
    <h1 i18n>Invitacion de la compañia {{ data.name }}</h1>
    <p i18n>Role: {{ data.role }}</p>
    <button i18n mat-button (click)="accept()">Acceptar</button>
    <button i18n mat-button (click)="decline()">Declinar</button>
  `,
})
export class InvitationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InvitationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  accept() {
    this.dialogRef.close('accepted');
  }

  decline() {
    this.dialogRef.close('declined');
  }
}
