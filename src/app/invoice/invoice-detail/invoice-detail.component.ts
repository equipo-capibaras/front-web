import { Component } from '@angular/core';
import { Invoice } from './invoice';
import { CommonModule, DatePipe } from '@angular/common';
import { InoviceService } from '../invoice.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss',
})
export class InvoiceDetailComponent {
  invoices: Invoice[] = [
    {
      id: 'emprendedor',
      price: $localize`:@@planEmprendedorPrice:$32.50`,

      TotalIncidentsWeb: $localize`:@@IncidentsCreatedWeb:$10.00.`,
      TotalIncidentsMobile: $localize`:@@IncidentsCreatedMobile:$11.25.`,
      TotalIncidentsEmail: $localize`:@@IncidentsCreatedEmail:$6.00.`,
      TotalIncidents: $localize`:@@SubtotalIncidents:$27.25.`,

      GenerationDate: $localize`:@@GenerationDate:2021-07-01`,
      PaidDate: $localize`:@@PaidDate:2021-07-10`,
      LimitPaidDate: $localize`:@@LimitPaidDate:2021-07-15`,

      startDate: $localize`:@@StartDate:2021-06-01`,
      endDate: $localize`:@@EndDate:2021-06-30`,
      planName: $localize`:@@PlanName:Plan Empresario`,
      monthCostPlan: $localize`:@@MonthlyCost:$27.25`,
    },
  ];

  constructor(
    private readonly invoiceService: InoviceService,
    private readonly snackbarService: SnackbarService,
  ) {}

  getInvoiceDetail() {
    this.invoiceService
      .invoiceDetail()
      .pipe()
      .subscribe({
        next: data => {
          if (data) {
            this.invoices = Array.isArray(data) ? data : [data];
          }
        },
        error: err => {
          this.snackbarService.showError(err);
        },
      });
  }
}
