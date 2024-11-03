import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-invite-confirm-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDivider,
  ],
  templateUrl: './invite-confirm-dialog.component.html',
})
export class InviteConfirmDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<InviteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: { username: string; role: string },
  ) {}

  employeeRole: Record<string, string> = {
    analyst: $localize`:@@employeeRegisterOptionRoleOAnalista:Analítica`,
    agent: $localize`:@@employeeRegisterOptionRoleAgente:Agente`,
    admin: $localize`:@@employeeRegisterOptionRoleAdmin:Administrador`,
  };

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
