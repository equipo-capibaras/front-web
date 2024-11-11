import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InoviceService } from '../invoice.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { Invoice } from './invoice';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
})
export class InvoiceDetailComponent implements OnInit {
  invoice: Invoice = {
    billing_month: '',
    billing_year: 0,
    client_id: '',
    client_name: '',
    due_date: '',
    client_plan: '',
    total_cost: 0,
    fixed_cost: 0,
    total_incidents: { web: 0, mobile: 0, email: 0 },
    unit_cost_per_incident: { web: 0, mobile: 0, email: 0 },
    total_cost_per_incident: { web: 0, mobile: 0, email: 0 },
  };
  localCurrency: string;
  exchangeRate = 1;

  constructor(
    private readonly invoiceService: InoviceService,
    private readonly snackbarService: SnackbarService,
    private readonly currencyService: CurrencyService,
  ) {
    this.localCurrency = this.currencyService.detectUserCurrency();
  }

  ngOnInit() {
    this.loadExchangeRate();
    this.getInvoiceDetail();
  }

  loadExchangeRate() {
    if (this.localCurrency !== 'USD') {
      this.currencyService
        .getExchangeRates()
        .subscribe((data: { rates: Record<string, number> }) => {
          this.exchangeRate = data.rates[this.localCurrency] || 1;
        });
    }
  }

  getInvoiceDetail() {
    this.invoiceService.invoiceDetail().subscribe({
      next: data => {
        if (data) {
          this.invoice = this.convertInvoiceCosts(data);
        } else {
          this.snackbarService.showError('Invoice data is null');
        }
      },
      error: err => {
        this.snackbarService.showError(err);
      },
    });
  }

  convertInvoiceCosts(invoice: Invoice): Invoice {
    // Convert cost-related fields using the exchange rate
    return {
      ...invoice,
      total_cost: invoice.total_cost * this.exchangeRate,
      fixed_cost: invoice.fixed_cost * this.exchangeRate,
      total_cost_per_incident: {
        web: invoice.total_cost_per_incident.web * this.exchangeRate,
        mobile: invoice.total_cost_per_incident.mobile * this.exchangeRate,
        email: invoice.total_cost_per_incident.email * this.exchangeRate,
      },
      unit_cost_per_incident: {
        web: invoice.unit_cost_per_incident.web * this.exchangeRate,
        mobile: invoice.unit_cost_per_incident.mobile * this.exchangeRate,
        email: invoice.unit_cost_per_incident.email * this.exchangeRate,
      },
    };
  }
}
