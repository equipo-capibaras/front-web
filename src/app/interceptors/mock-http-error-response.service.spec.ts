import { TestBed, inject } from '@angular/core/testing';
import { MockHttpErrorResponseService } from './mock-http-error-response.service';

describe('Service: MockHttpErrorResponse', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockHttpErrorResponseService],
    });
  });

  it('Mock interceptor should be available', inject(
    [MockHttpErrorResponseService],
    (service: MockHttpErrorResponseService) => {
      expect(service).toBeTruthy();
    },
  ));
});
