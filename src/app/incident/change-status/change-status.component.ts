import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // Reemplaza BrowserModule con CommonModule
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { IncidentService } from '../incident.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-status',
  standalone: true,
  imports: [
    CommonModule, // Reemplazado por CommonModule
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss'],
})
export class ChangeStatusComponent implements OnInit {
  statusForm: FormGroup;
  statuses = ['Escalado', 'Cerrado'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { status: string; comment: string; incident_id: string },
    private readonly incidentService: IncidentService,
    private snackbarService: SnackbarService,
    private readonly route: ActivatedRoute,
  ) {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      comment: ['', Validators.required],
      //incident_id: [this.route.snapshot.paramMap.get('id')],
      incident_id: [this.data.incident_id, Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.data) {
      this.statusForm.patchValue({
        status: this.data.status,
        comment: this.data.comment,
      });
    }
  }

  get status() {
    return this.statusForm.get('status')!;
  }

  get comment() {
    return this.statusForm.get('comment')!;
  }
  get incident_id() {
    return this.statusForm.get('incident_id')!;
  }

  onSubmit(): void {
    if (this.statusForm.valid) {
      const status = this.status.value;
      const comment = this.comment.value;
      const incident_id = this.incident_id.value;

      this.incidentService.changeStatusIncident(status, comment, incident_id).subscribe({
        next: success => {
          if (!success) {
            return;
          }
          this.dialogRef.close();
          this.snackbarService.showSuccess('Se ha cambiado el estado exitosamente.');

          this.dialogRef.close(this.statusForm.value);
        },
        error: _error => {
          this.snackbarService.showError('Ocurrió un error al cambiar el estado.');
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
