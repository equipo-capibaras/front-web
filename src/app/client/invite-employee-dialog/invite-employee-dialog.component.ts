import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
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
import { MatDialogRef } from '@angular/material/dialog';

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
  inviteForm: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<InviteEmployeeDialogComponent>,
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
      const { email } = this.inviteForm.value;

      this.clientService.inviteUser(email).subscribe(success => {
        if (success) {
          const role = this.authService.getRole();
          if (role) {
            this.router.navigate([role]);
          }
          this.dialogRef.close();
        } else {
          // Handle the error case (e.g., show a snackbar message)
        }
      });
    } else {
      this.inviteForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
