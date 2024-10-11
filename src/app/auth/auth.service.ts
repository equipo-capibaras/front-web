import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, map, catchError, Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { Role } from './role';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private userRoleSubject = new BehaviorSubject<Role | null>(null); // Create a BehaviorSubject
  public userRole$ = this.userRoleSubject.asObservable(); // Expose it as an observable

  constructor(
    private readonly http: HttpClient,
    private router: Router,
  ) {
    this.setUserRole(); // Initialize the user role from local storage on service instantiation
  }

  private setUserRole(): void {
    const role = this.getRole();
    this.userRoleSubject.next(role); // Emit the current role
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

  logout(): void {
    localStorage.removeItem('token');
    this.userRoleSubject.next(null);
    this.router.navigate(['/']);
  }
}
