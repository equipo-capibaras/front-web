import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly apiURL =
    'https://v6.exchangerate-api.com/v6/a5c24ce9701ee48bccb7288c/latest/USD'; // Base URL for the API
  private Rates: { rates: Record<string, string>; base: string; result: string } | null = null;

  constructor(private readonly http: HttpClient) {}

  getExchangeRates(
    baseCurrency: string,
  ): Observable<{ rates: Record<string, string>; base: string; result: string }> {
    if (this.Rates && this.Rates.base === baseCurrency) {
      return of(this.Rates);
    }

    const url = `${this.apiURL}`;

    return this.http.get<{ conversion_rates: Record<string, string>; result: string }>(url).pipe(
      map(response => {
        const result = {
          rates: response.conversion_rates,
          base: baseCurrency,
          result: response.result,
        };
        return result;
      }),
      catchError(error => {
        console.error('Error fetching exchange rates:', error);
        return of({ rates: {}, base: baseCurrency, result: '' });
      }),
    );
  }

  detectUserCurrency(): string {
    const locale = navigator.language;
    const currencyMap: Record<string, string> = {
      'es-CO': 'COP', // Colombia -> COP
      'pt-BR': 'BRL', // Brazil -> BRL
      'es-AR': 'ARS', // Argentina -> ARS
    };

    return currencyMap[locale] || 'USD';
  }
}
