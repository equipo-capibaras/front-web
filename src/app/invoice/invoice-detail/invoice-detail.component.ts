import { Component, OnInit } from '@angular/core';
import { InoviceService } from '../invoice.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { Invoice } from './invoice';
import currency from 'currency.js';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeService } from '../../employee/employee.service';

export interface InvoiceFrontend {
  billing_month: Date | null;
  billing_year: number;
  client_id: string;
  client_name: string;
  due_date: string;
  client_plan: string;
  total_cost: string;
  fixed_cost: string;
  total_incidents: { web: number; mobile: number; email: number };
  unit_cost_per_incident: { web: string; mobile: string; email: string };
  total_cost_per_incident: { web: string; mobile: string; email: string };
  subtotal: string;
}

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
})
export class InvoiceDetailComponent implements OnInit {
  invoice: InvoiceFrontend = {
    billing_month: null,
    billing_year: 0,
    client_id: '',
    client_name: '',
    due_date: '',
    client_plan: '',
    total_cost: '',
    subtotal: '',
    fixed_cost: '',
    total_incidents: { web: 0, mobile: 0, email: 0 },
    unit_cost_per_incident: { web: '', mobile: '', email: '' },
    total_cost_per_incident: { web: '', mobile: '', email: '' },
  };
  localCurrency: string;
  exchangeRates: { rates: Record<string, string>; base: string; result: string } | null = null;
  exchangeRate = 1;
  firstInvoiceDate: Date | null = null;
  firstInvoiceAvailable: boolean | null = null;

  clientPlan: Record<string, string> = {
    emprendedor: $localize`:@@planEmprendedorTitle:Emprendedor`,
    empresario: $localize`:@@planEmpresarioTitle:Empresario`,
    empresario_plus: $localize`:@@planEmpresarioPlusTitle:Empresario +`,
  };

  constructor(
    private readonly invoiceService: InoviceService,
    private readonly snackbarService: SnackbarService,
    private readonly currencyService: CurrencyService,
    private readonly employeeService: EmployeeService,
  ) {
    this.localCurrency = this.currencyService.detectUserCurrency();
  }

  ngOnInit() {
    this.employeeService.loadEmployeeData().subscribe(data => {
      const registrationDate = new Date(data.invitationDate);
      this.firstInvoiceDate = new Date(
        registrationDate.getFullYear(),
        registrationDate.getMonth() + 1,
        1,
      );

      this.firstInvoiceAvailable = new Date() > this.firstInvoiceDate;

      if (this.firstInvoiceAvailable) {
        this.loadExchangeRate();
      }
    });
  }

  loadExchangeRate() {
    this.currencyService.getExchangeRates(this.localCurrency).subscribe(
      data => {
        this.exchangeRates = data;

        if (this.exchangeRates && this.exchangeRates.rates) {
          const rate = this.exchangeRates.rates[this.localCurrency];
          if (rate) {
            this.exchangeRate = parseFloat(rate);
            this.getInvoiceDetail();
          } else {
            console.error('No exchange rate found for', this.localCurrency);
          }
        } else {
          console.error('Exchange rate data structure is invalid');
        }
      },
      error => {
        console.error('Error fetching exchange rates:', error);
        this.snackbarService.showError('Failed to fetch exchange rates');
      },
    );
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

  convertInvoiceCosts(invoice: Invoice): InvoiceFrontend {
    const totalCost = invoice.total_cost;
    const fixedCost = invoice.fixed_cost;

    if (this.exchangeRate === 0) {
      console.error('Invalid exchange rate, cannot convert invoice costs');
      return {
        ...invoice,
        client_plan: this.clientPlan[invoice.client_plan],
        billing_month: new Date(`${invoice.billing_month} 1, 2000`),
        subtotal: this.formatCurrency(invoice.total_cost - invoice.fixed_cost),
        total_cost: this.formatCurrency(invoice.total_cost),
        fixed_cost: this.formatCurrency(invoice.fixed_cost),
        total_cost_per_incident: {
          web: this.formatCurrency(invoice.total_cost_per_incident.web),
          mobile: this.formatCurrency(invoice.total_cost_per_incident.mobile),
          email: this.formatCurrency(invoice.total_cost_per_incident.email),
        },
        unit_cost_per_incident: {
          web: this.formatCurrency(invoice.unit_cost_per_incident.web),
          mobile: this.formatCurrency(invoice.unit_cost_per_incident.mobile),
          email: this.formatCurrency(invoice.unit_cost_per_incident.email),
        },
      };
    }

    const Invoices = {
      ...invoice,
      client_plan: this.clientPlan[invoice.client_plan],
      billing_month: new Date(`${invoice.billing_month} 1, 2000`),
      subtotal: this.formatCurrency(totalCost - fixedCost),
      total_cost: this.formatCurrency(totalCost),
      fixed_cost: this.formatCurrency(fixedCost),
      total_cost_per_incident: {
        web: this.formatCurrency(invoice.total_cost_per_incident.web),
        mobile: this.formatCurrency(invoice.total_cost_per_incident.mobile),
        email: this.formatCurrency(invoice.total_cost_per_incident.email),
      },
      unit_cost_per_incident: {
        web: this.formatCurrency(invoice.unit_cost_per_incident.web),
        mobile: this.formatCurrency(invoice.unit_cost_per_incident.mobile),
        email: this.formatCurrency(invoice.unit_cost_per_incident.email),
      },
    };

    return Invoices;
  }

  formatCurrency(amount: number): string {
    if (this.exchangeRate === 0) {
      return 'Invalid rate';
    }
    let formattedCurrency = '';

    formattedCurrency = currency(amount * this.exchangeRate, {
      symbol: this.localCurrency + ' ',
      separator: ',',
      decimal: '.',
    }).format();

    return formattedCurrency;
  }
}
