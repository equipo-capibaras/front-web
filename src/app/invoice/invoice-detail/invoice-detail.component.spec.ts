import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { InvoiceDetailComponent } from './invoice-detail.component';
import { InoviceService } from '../invoice.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../employee/employee.service';
import { faker } from '@faker-js/faker';

describe('InvoiceDetailComponent', () => {
  let component: InvoiceDetailComponent;
  let fixture: ComponentFixture<InvoiceDetailComponent>;
  let invoiceService: jasmine.SpyObj<InoviceService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let currencyService: jasmine.SpyObj<CurrencyService>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    invoiceService = jasmine.createSpyObj('InoviceService', ['invoiceDetail']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showError']);
    currencyService = jasmine.createSpyObj('CurrencyService', [
      'detectUserCurrency',
      'getExchangeRates',
    ]);
    employeeService = jasmine.createSpyObj('EmployeeService', ['loadEmployeeData']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mocks
    currencyService.detectUserCurrency.and.returnValue('USD');
    currencyService.getExchangeRates.and.returnValue(
      of({ rates: { USD: '1', EUR: '0.8' }, base: 'USD', result: 'success' }),
    );

    invoiceService.invoiceDetail.and.returnValue(
      of({
        billing_month: 'January',
        billing_year: 2024,
        client_id: '123',
        client_name: 'Client A',
        due_date: '2024-02-28',
        client_plan: 'Premium',
        total_cost: 1000,
        fixed_cost: 500,
        total_incidents: { web: 10, mobile: 5, email: 3 },
        unit_cost_per_incident: { web: 50, mobile: 30, email: 20 },
        total_cost_per_incident: { web: 500, mobile: 150, email: 60 },
      }),
    );

    employeeService.loadEmployeeData.and.returnValue(
      of({
        id: faker.string.uuid(),
        clientId: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'admin',
        invitationStatus: 'accepted',
        invitationDate: faker.date.birthdate(),
      }),
    );

    TestBed.configureTestingModule({
      imports: [InvoiceDetailComponent, NoopAnimationsModule], // Import the standalone component here
      providers: [
        { provide: InoviceService, useValue: invoiceService },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: CurrencyService, useValue: currencyService },
        { provide: EmployeeService, useValue: employeeService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  }));

  function setupComponent() {
    fixture = TestBed.createComponent(InvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create and load invoice details', () => {
    setupComponent();
    expect(component).toBeTruthy();
    expect(component.invoice.client_name).toBe('Client A');
    expect(component.invoice.total_cost).toBe('USD 1,000.00');
  });

  it('should load invoice details with exchange rate', () => {
    const mockInvoice = {
      billing_month: 'January',
      billing_year: 2024,
      client_id: '123',
      client_name: 'Client A',
      due_date: '2024-02-28',
      client_plan: 'Premium',
      total_cost: 1000,
      fixed_cost: 500,
      total_incidents: { web: 10, mobile: 5, email: 3 },
      unit_cost_per_incident: { web: 50, mobile: 30, email: 20 },
      total_cost_per_incident: { web: 500, mobile: 150, email: 60 },
    };

    invoiceService.invoiceDetail.and.returnValue(of(mockInvoice));
    setupComponent();

    expect(component.invoice.total_cost).toBe('USD 1,000.00');
    expect(component.invoice.fixed_cost).toBe('USD 500.00');
    expect(component.invoice.total_cost_per_incident.web).toBe('USD 500.00');
  });

  it('should handle null invoice data and show an error', () => {
    invoiceService.invoiceDetail.and.returnValue(of(null));
    setupComponent();

    expect(snackbarService.showError).toHaveBeenCalledWith('Invoice data is null');
  });

  it('should show an error when exchange rates fail to load', () => {
    currencyService.getExchangeRates.and.returnValue(throwError('Network error'));

    setupComponent();

    expect(snackbarService.showError).toHaveBeenCalledWith('Failed to fetch exchange rates');
  });

  it('should handle invalid exchange rate (zero)', () => {
    currencyService.getExchangeRates.and.returnValue(
      of({ rates: { USD: '0' }, base: 'USD', result: 'success' }),
    );

    setupComponent();

    expect(component.invoice.subtotal).toBe('Invalid rate');
    expect(component.invoice.total_cost).toBe('Invalid rate');
  });

  it('should convert invoice costs correctly when exchange rates are available', () => {
    const mockInvoice = {
      billing_month: 'January',
      billing_year: 2024,
      client_id: '123',
      client_name: 'Client A',
      due_date: '2024-02-28',
      client_plan: 'Premium',
      total_cost: 1000,
      fixed_cost: 500,
      total_incidents: { web: 10, mobile: 5, email: 3 },
      unit_cost_per_incident: { web: 50, mobile: 30, email: 20 },
      total_cost_per_incident: { web: 500, mobile: 150, email: 60 },
    };

    invoiceService.invoiceDetail.and.returnValue(of(mockInvoice));
    setupComponent();

    expect(component.invoice.total_cost).toBe('USD 1,000.00');
    expect(component.invoice.fixed_cost).toBe('USD 500.00');
    expect(component.invoice.subtotal).toBe('USD 500.00');
  });

  it('should handle null invoice data', () => {
    invoiceService.invoiceDetail.and.returnValue(of(null));
    setupComponent();

    expect(snackbarService.showError).toHaveBeenCalledWith('Invoice data is null');
  });

  it('should log an error when no exchange rate is found for the local currency', () => {
    spyOn(console, 'error');

    currencyService.getExchangeRates.and.returnValue(
      of({ rates: {}, base: 'USD', result: 'success' }),
    );

    setupComponent();

    expect(console.error).toHaveBeenCalledWith('No exchange rate found for', 'USD');
  });
});
