// currency.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private exchangeRateApiUrl = 'https://open.er-api.com/v6/latest/USD';

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<any> {
    // Implement the API call here
    return this.http.get<any>('https://open.er-api.com/v6/latest/USD');
  }

  detectUserCurrency(): string {
    const locale = navigator.language;
    const currencyMap: Record<string, string> = {
      'en-US': 'USD',
      'es-CO': 'COP',
      'pt-BR': 'BRL',
      'es-AR': 'ARS',
    };
    return currencyMap[locale] || 'USD';
  }
}
