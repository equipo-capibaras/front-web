/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IncidentService } from './incident.service';

describe('Service: Incident', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IncidentService],
    });
  });

  it('should ...', inject([IncidentService], (service: IncidentService) => {
    expect(service).toBeTruthy();
  }));
});
