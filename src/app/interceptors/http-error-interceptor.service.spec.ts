/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { HttpErrorInterceptorService } from './http-error-interceptor.service';
import { Toast, ToastrModule } from 'ngx-toastr';

describe('Service: HttpErrorInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpErrorInterceptorService],
      imports: [ToastrModule.forRoot()],
    });
  });

  it('should ...', inject([HttpErrorInterceptorService], (service: HttpErrorInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
