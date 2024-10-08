import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * Método para autenticar un usuario.
   * @param username El nombre de usuario.
   * @param password La contraseña del usuario.
   * @returns Un observable con la respuesta del servidor.
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/employee`, { username, password });
  }
}
