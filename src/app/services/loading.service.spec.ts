import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a default loading state of false', done => {
    service.loading$.subscribe(loading => {
      expect(loading).toBeFalse();
      done();
    });
  });

  it('should emit true when setLoading(true) is called', done => {
    service.setLoading(true);
    service.loading$.subscribe(loading => {
      expect(loading).toBeTrue();
      done();
    });
  });

  it('should emit false when setLoading(false) is called after being true', done => {
    service.setLoading(true);
    service.setLoading(false);

    service.loading$.subscribe(loading => {
      expect(loading).toBeFalse();
      done();
    });
  });
});
