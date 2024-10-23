import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-plan',
  templateUrl: './confirm-plan.component.html',
  styleUrls: ['./confirm-plan.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPlanComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmPlanComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  isWithinAdvancePaymentPeriod: boolean;
  billingMessage: string;

  constructor() {
    const today = new Date();
    const currentDay = today.getDate();

    this.isWithinAdvancePaymentPeriod = currentDay <= 5;

    if (this.isWithinAdvancePaymentPeriod) {
      this.billingMessage = $localize`:@@changePlanNotBillingPeriod:Estás dentro de los 5 primeros días del mes. El cambio de plan se reflejará en tu factura de este mes.`;
    } else {
      this.billingMessage = $localize`:@@changePlanIsBillingPeriod:El cambio de plan se aplicará a partir del próximo mes.`;
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
