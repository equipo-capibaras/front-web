import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<{ rates: Record<string, number>; base: string; date: string }> {
    return this.http.get<{ rates: Record<string, number>; base: string; date: string }>(
      'https://open.er-api.com/v6/latest/USD',
    );
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
