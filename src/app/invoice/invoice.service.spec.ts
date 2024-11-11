import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Invoice } from './invoice-detail/invoice';
import { InoviceService } from './invoice.service';

describe('InoviceService', () => {
  let service: InoviceService;
  let httpMock: HttpTestingController;

  const mockInvoice: Invoice = {
    billing_month: 'January',
    billing_year: 2024,
    client_id: '123',
    client_name: 'Client A',
    due_date: '2024-02-01',
    client_plan: 'Basic',
    total_cost: 1000,
    fixed_cost: 200,
    total_incidents: { web: 10, mobile: 5, email: 2 },
    unit_cost_per_incident: { web: 50, mobile: 100, email: 150 },
    total_cost_per_incident: { web: 500, mobile: 500, email: 300 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InoviceService],
    });
    service = TestBed.inject(InoviceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures there are no outstanding requests
  });

  it('should fetch invoice details successfully', () => {
    service.invoiceDetail().subscribe(invoice => {
      expect(invoice).toEqual(mockInvoice);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/invoice`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInvoice); // Respond with the mock data
  });

  it('should handle error when fetching invoice details fails', () => {
    const errorMessage = 'Error loading invoice details';

    service.invoiceDetail().subscribe({
      next: () => fail('should have failed with an error'),
      error: error => {
        expect(error.message).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/invoice`);
    expect(req.request.method).toBe('GET');
    req.flush('Error loading invoice details', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });
});
