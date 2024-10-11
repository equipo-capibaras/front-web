import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, map, catchError, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { Role } from './role';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * Logs in a user by sending a POST request to the server.
   * @param username The username of the user
   * @param password The password of the user
   * @returns A boolean whether the login was successful or not.
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/employee`, { username, password })
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          return true;
        }),
        catchError(() => {
          return of(false);
        }),
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    return token !== null;
  }

  getRole(): Role | null {
    const token = localStorage.getItem('token');

    if (token === null) {
      return null;
    }

    const decodedToken = jwtDecode(token);
    const role = Object.values(Role).includes(decodedToken.aud as Role)
      ? (decodedToken.aud as Role)
      : null;

    return role;
  }
}
