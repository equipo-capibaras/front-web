import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * Método para autenticar un usuario.
   * @param username El nombre de usuario.
   * @param password La contraseña del usuario.
   * @returns Un observable con la respuesta del servidor.
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/employee`, { username, password })
      .pipe(
        catchError(error => {
          // Log the error or perform any other error handling
          console.error('An error occurred during login:', error);
          return throwError(() => new Error('Login failed. Please try again.'));
        }),
      );
  }
}
