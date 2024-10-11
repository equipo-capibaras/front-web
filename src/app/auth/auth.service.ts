import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, map, catchError, Observable, BehaviorSubject } from 'rxjs';
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
  private userRoleSubject = new BehaviorSubject<Role | null>(this.loadRoleFromToken());
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  private loadRoleFromToken(): Role | null {
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

  private setUserRole(): void {
    this.userRoleSubject.next(this.loadRoleFromToken());
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/employee`, { username, password })
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          this.setUserRole(); // Set the user role after successful login
          return true;
        }),
        catchError(() => {
          return of(false);
        }),
      );
  }

  getRole(): Role | null {
    return this.userRoleSubject.value;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.setUserRole();
  }
}
