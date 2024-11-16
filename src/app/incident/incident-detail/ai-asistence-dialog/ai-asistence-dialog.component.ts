import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-ai-asistence-dialog',
  templateUrl: './ai-asistence-dialog.component.html',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./ai-asistence-dialog.component.scss'],
})
export class AIAsistenceDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AIAsistenceDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
