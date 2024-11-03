import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { ClientService } from '../../client/client.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './invite-message.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDivider,
  ],
})
export class InvitationDialogComponent implements OnInit {
  companyName = '';

  constructor(
    private readonly dialogRef: MatDialogRef<InvitationDialogComponent>,
    private readonly clientService: ClientService,
  ) {}

  ngOnInit(): void {
    this.clientService.loadClientData().subscribe({
      next: data => {
        if (data) {
          this.companyName = data.name;
        }
      },
    });
  }

  onConfirm(): void {
    this.dialogRef.close('accepted');
  }

  onDecline(): void {
    this.dialogRef.close('declined');
  }
}
