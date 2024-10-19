import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService],
    });
    service = TestBed.inject(EmployeeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no unmatched requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register an employee', () => {
    const mockEmployeeData = {
      name: 'Tim',
      email: 'Tim@example.com',
      password: 'Admin123',
      role: 'Admin',
    };
    const mockResponse = { id: '123', ...mockEmployeeData };

    service.registerEmployee(mockEmployeeData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`/api/v1/employees`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse); // Return mock response data
  });

  it('should handle conflict error (email already registered)', () => {
    const mockEmployeeData = {
      name: 'viviana',
      email: 'viviana@example.com',
      password: 'Admin123',
      role: 'Admin',
    };
    const mockErrorResponse = {
      status: 409,
      statusText: 'Conflict',
      error: { message: 'Email already registered' },
    };

    service.registerEmployee(mockEmployeeData).subscribe(success => {
      expect(success).toBeFalse();
    });

    const req = httpTestingController.expectOne(`/api/v1/employees`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockErrorResponse.error, mockErrorResponse);
  });
});
