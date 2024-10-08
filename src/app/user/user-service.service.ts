import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
}

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
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/employee`, { username, password });
  }
}
