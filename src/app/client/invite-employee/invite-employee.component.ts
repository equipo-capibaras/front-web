import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { InviteEmployeeDialogComponent } from '../invite-employee-dialog/invite-employee-dialog.component';
@Component({
  selector: 'app-invite-employee',
  standalone: true,
  templateUrl: './invite-employee.component.html',
  imports: [MatButtonModule],
})
export class InviteEmployeeComponent {
  constructor(private dialog: MatDialog) {}

  openInviteDialog(): void {
    this.dialog.open(InviteEmployeeDialogComponent, {
      width: '461px',
    });
  }
}
