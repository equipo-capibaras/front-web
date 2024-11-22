import { Injectable } from '@angular/core';
import { of, map, catchError, Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Role } from './role';
import { NO_TOKEN } from '../interceptors/token.interceptor';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { ERROR_MESSAGES } from '../shared/error-messages';
import { HttpClient, HttpContext } from '@angular/common/http';
import { defaultRoutes } from './default.routes';

interface DecodedToken {
  aud: string;
  role: Role;
}

interface TokenResponse {
  token: string;
}

export interface Invitation {
  id: string;
  clientId: string;
  invitationStatus: 'pending' | 'accepted' | 'declined';
  name: string;
  email: string;
  role: string;
  invitationDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly userRoleSubject = new BehaviorSubject<Role | null>(this.loadRoleFromToken());
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly snackbarService: SnackbarService,
  ) {}

  private loadRoleFromToken(): Role | null {
    const token = localStorage.getItem('token');

    if (token === null) {
      return null;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const role = Object.values(Role).includes(decodedToken.role) ? decodedToken.role : null;

      return role;
    } catch {
      return null;
    }
  }

  private setUserRole(): void {
    this.userRoleSubject.next(this.loadRoleFromToken());
  }

  login(username: string, password: string): Observable<boolean> {
    const context = new HttpContext().set(NO_TOKEN, true);

    return this.http
      .post<TokenResponse>(
        `${this.apiUrl}/auth/employee`,
        { username, password },
        { context: context },
      )
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          this.setUserRole();
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

  isUnassigned(): boolean | null {
    const token = localStorage.getItem('token');

    if (token === null) {
      return null;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken.aud.startsWith('unassigned_');
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.setUserRole();
  }

  refreshToken(redirectToDefaultPage?: boolean) {
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/employee/refresh`, {}).pipe(
      map(response => {
        localStorage.setItem('token', response.token);
        this.setUserRole();

        const role = this.getRole();

        if (redirectToDefaultPage && role) {
          this.router.navigate([defaultRoutes[role]]);
        }

        return true;
      }),
      catchError(() => {
        return of(false);
      }),
    );
  }

  getAnalyticsToken(): Observable<string> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/employee/analytics`, {}).pipe(
      map(response => {
        return response.token;
      }),
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  handleTokenExpired() {
    this.snackbarService.showError(ERROR_MESSAGES.JWT_EXPIRED);
    localStorage.removeItem('token');
    this.setUserRole();
    this.router.navigate(['/']);
  }
}
