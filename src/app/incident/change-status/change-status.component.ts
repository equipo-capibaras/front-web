import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IncidentClosedError, IncidentNotFoundError, IncidentService } from '../incident.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-change-status',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
  ],
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss'],
})
export class ChangeStatusComponent implements OnInit {
  statusForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ChangeStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { incidentId: string },
    private readonly incidentService: IncidentService,
    private readonly snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.statusForm = this.formBuilder.group({
      status: ['', [Validators.required]],
      comment: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get status() {
    return this.statusForm.get('status')!;
  }

  get comment() {
    return this.statusForm.get('comment')!;
  }

  submit(): void {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const status = this.status.value;
    const comment = this.comment.value;

    this.incidentService.changeStatusIncident(status, comment, this.data.incidentId).subscribe({
      next: () => {
        this.snackbarService.showSuccess(
          $localize`:@@incidentChangeStatusSuccess:Se ha cambiado el estado exitosamente.`,
        );
      },
      error: error => {
        if (error instanceof IncidentClosedError) {
          this.snackbarService.showError(
            $localize`:@@incidentAlreadyClosed:El incidente ya está cerrado.`,
          );
        }
        if (error instanceof IncidentNotFoundError) {
          this.snackbarService.showError(
            $localize`:@@incidentNotFound:No se encontró el incidente.`,
          );
        }
      },
      complete: () => {
        this.dialogRef.close();
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
