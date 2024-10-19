import { TestBed } from '@angular/core/testing';

import { CompanyRegisterService } from './company-register.service';

describe('CompanyRegisterService', () => {
  let service: CompanyRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
