import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';

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
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDivider,
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
    private readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InviteEmployeeDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.inviteForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
    });
  }

  get email() {
    return this.inviteForm.get('email')!;
  }

  submit() {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.email.value);
  }

  close() {
    this.dialogRef.close();
  }
}
