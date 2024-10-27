import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  ClientService,
  DuplicateEmployeeExistError,
  EmployeeNoFoundError,
} from '../client.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from './dialog.services';

@Component({
  selector: 'app-invite-employee-dialog',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
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
  inviteForm!: FormGroup;

  @ViewChild('confirmationDialog') confirmationDialog!: TemplateRef<{
    email: string;
    role: string;
  }>;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly clientService: ClientService,
    private readonly dialogService: DialogService,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<InviteEmployeeDialogComponent>,
    private dialog: MatDialog,
  ) {}

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

      this.clientService.getRoleByEmail(email).subscribe({
        next: data => {
          const role = data.role;

          this.openConfirmationDialog(email, role);
        },
        error: error => {
          if (error instanceof DuplicateEmployeeExistError) {
            this.snackbarService.showError('Empleado ya vinculado a tu empresa.');
          }
          if (error instanceof EmployeeNoFoundError) {
            this.snackbarService.showError('No se encontró el empleado.');
          }
        },
      });
    }
  }
  openConfirmationDialog(email: string, role: string): void {
    console.log(role);
    console.log(email);
    this.dialog
      .open(this.confirmationDialog, {
        data: { email, role },
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.onConfirmInvite(email);
        }
      });
  }

  onConfirmInvite(email: string) {
    this.clientService.inviteUser(email).subscribe({
      next: success => {
        if (!success) {
          return;
        }
        this.dialogRef.close();
        this.snackbarService.showSuccess('Empleado invitado exitosamente.');

        // Close all dialogs
        this.dialogService.closeAllDialogs();

        // Refresh the page
        window.location.reload();
      },
      error: error => {
        if (error instanceof DuplicateEmployeeExistError) {
          this.snackbarService.showError('Empleado ya vinculado a tu empresa.');
        }
        if (error instanceof EmployeeNoFoundError) {
          this.snackbarService.showError('No se encontró el empleado.');
        }
      },
    });
  }
  inviteUserBack(email: string): void {
    if (this.inviteForm.valid) {
      console.log(email);

      this.clientService.inviteUser(email).subscribe({
        next: success => {
          if (!success) {
            return;
          }

          this.snackbarService.showSuccess(
            $localize`:@@employeeRegisterSuccess:Empleado invitado exitosamente.`,
          );

          if (success) {
            const role = this.authService.getRole();
            if (role) {
              this.router.navigate([role]);
            }
            this.dialogService.closeAllDialogs();
            this.dialogRef.close();
          } else {
            // Handle the error case (e.g., show a snackbar message)
          }
        },
        error: error => {
          if (error instanceof DuplicateEmployeeExistError) {
            this.snackbarService.showError(
              $localize`:@@DuplicateEmployeeExistError:Empleado ya vinculado a tu empresa.`,
            );
          }
        },
      });
      this.dialogService.closeAllDialogs();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCancelThis(): void {
    this.dialogService.closeAllDialogs();
  }
}
