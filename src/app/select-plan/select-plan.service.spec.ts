import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SelectPlanService } from './select-plan.service';
import { HttpClient } from '@angular/common/http';

describe('SelectPlanService', () => {
  let service: SelectPlanService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SelectPlanService],
    });

    service = TestBed.inject(SelectPlanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully save the plan', () => {
    const mockResponse = { id: '123', name: 'Pro Plan', price: 100, date: '2024-10-20' };
    const planData = { name: 'Pro Plan', price: 100, date: '2024-10-20' };

    service.savePlan(planData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    // Simulate HTTP request
    const req = httpMock.expectOne('/api/v1/selectplan');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(planData);

    // Respond with mock data
    req.flush(mockResponse);
  });

  it('should handle error during plan saving', () => {
    const planData = { name: 'Pro Plan', price: 100, date: '2024-10-20' };
    const mockError = { status: 500, statusText: 'Internal Server Error' };

    spyOn(window, 'alert');

    service.savePlan(planData).subscribe(response => {
      expect(response).toBeFalse();
    });

    const req = httpMock.expectOne('/api/v1/selectplan');
    req.flush(mockError, { status: 500, statusText: 'Internal Server Error' });

    expect(window.alert).toHaveBeenCalledWith('Error saving plan. Please try again.');
  });
});
