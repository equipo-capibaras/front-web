import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';
import { LOCALE_ID } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

import localeEsCo from '@angular/common/locales/es-CO';
import localeEsAr from '@angular/common/locales/es-AR';
import localePtBr from '@angular/common/locales/pt';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  function setup(locale: string) {
    TestBed.configureTestingModule({
      providers: [
        CurrencyService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: locale },
      ],
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    setup('en-US');
    expect(service).toBeTruthy();
  });

  it('should return cached rates if they exist', () => {
    setup('en-US');
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
    setup('en-US');
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
    setup('en-US');
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

  it('should return COP for locale es-CO', () => {
    registerLocaleData(localeEsCo);
    setup('es-CO');
    expect(service.detectUserCurrency()).toBe('COP');
  });

  it('should return BRL for locale pt-BR', () => {
    registerLocaleData(localePtBr);
    setup('pt-BR');
    expect(service.detectUserCurrency()).toBe('BRL');
  });

  it('should return ARS for locale es-AR', () => {
    registerLocaleData(localeEsAr);
    setup('es-AR');
    expect(service.detectUserCurrency()).toBe('ARS');
  });

  it('should return USD for unknown locale', () => {
    setup('fr-FR');
    expect(service.detectUserCurrency()).toBe('USD');
  });
});
