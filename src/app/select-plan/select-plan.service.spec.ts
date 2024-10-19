import { TestBed } from '@angular/core/testing';

import { SelectPlanService } from './select-plan.service';

describe('SelectPlanService', () => {
  let service: SelectPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
