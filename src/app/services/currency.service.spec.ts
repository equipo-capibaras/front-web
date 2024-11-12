import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService],
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getExchangeRates', () => {
    it('should return cached rates if they exist', () => {
      const cachedRates = {
        rates: { EUR: '0.85', GBP: '0.75' },
        base: 'USD',
        result: 'success',
      };

      service['Rates'] = cachedRates;

      service.getExchangeRates('USD').subscribe(result => {
        expect(result).toEqual(cachedRates);
      });
    });

    it('should make an HTTP call if no cached rates are available', () => {
      const mockResponse = {
        conversion_rates: { EUR: '0.85', GBP: '0.75' },
        result: 'success',
      };

      const expectedResponse = {
        rates: mockResponse.conversion_rates,
        base: 'USD',
        result: mockResponse.result,
      };

      service.getExchangeRates('USD').subscribe(result => {
        expect(result).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne(
        'https://v6.exchangerate-api.com/v6/a5c24ce9701ee48bccb7288c/latest/USD',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return an empty rates object on error', () => {
      service.getExchangeRates('USD').subscribe(result => {
        expect(result.rates).toEqual({});
        expect(result.base).toBe('USD');
        expect(result.result).toBe('');
      });

      const req = httpMock.expectOne(
        'https://v6.exchangerate-api.com/v6/a5c24ce9701ee48bccb7288c/latest/USD',
      );
      req.error(new ErrorEvent('Network error'));
    });
  });
});
