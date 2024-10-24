import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ClientService } from '../client.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invite-employee-dialog',
  standalone: true,
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './invite-employee-dialog.component.html',
  styleUrls: ['./invite-employee-dialog.component.scss'],
})
export class InviteEmployeeDialogComponent implements OnInit {
  inviteForm: FormGroup;

  @ViewChild('confirmationDialog') confirmationDialog: TemplateRef<any>;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<InviteEmployeeDialogComponent>,
    private dialog: MatDialog,
  ) {
    this.inviteForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
    });
  }

  ngOnInit(): void {
    this.inviteForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      },
      {},
    );
  }

  get email() {
    return this.inviteForm.get('email')!;
  }

  inviteUser(): void {
    if (this.inviteForm.valid) {
      const email = this.inviteForm.value.email;

      this.openConfirmationDialog(email);
    } else {
      this.inviteForm.markAllAsTouched();
    }
  }

  openConfirmationDialog(email: string) {
    const dialogRef = this.dialog.open(this.confirmationDialog, {
      data: { email },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onConfirmInvite(email);
      }
    });
  }

  onConfirmInvite(email: string) {
    this.clientService.inviteUser(email).subscribe(success => {
      if (success) {
        const role = this.authService.getRole();
        if (role) {
          this.router.navigate([role]);
        }
        this.dialogRef.close();
      } else {
        // Si falla, muestra un mensaje de error
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
