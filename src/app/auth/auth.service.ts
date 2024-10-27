import { Injectable } from '@angular/core';
import { of, map, catchError, Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Role } from './role';
import { NO_TOKEN } from '../interceptors/token.interceptor';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { ERROR_MESSAGES } from '../shared/error-messages';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';

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

  logout(): void {
    localStorage.removeItem('token');
    this.setUserRole();
  }

  refreshToken() {
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/employee/refresh`, {}).pipe(
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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  handleTokenExpired() {
    this.snackbarService.showError(ERROR_MESSAGES.JWT_EXPIRED);
    localStorage.removeItem('token');
    this.setUserRole();
    this.router.navigate(['/']);
  }

  checkPendingInvitation(token: string): Observable<Invitation | null> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<Invitation | null>(`${this.apiUrl}/employees/me`, { headers })
      .pipe(catchError(() => of(null)));
  }

  acceptInvitation(): Observable<void> {
    const body = { response: 'accepted' };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken}`,
    });

    return this.http.post<void>(`${this.apiUrl}/employees/invitation`, body, { headers }).pipe(
      catchError(_err => {
        this.snackbarService.showError('INVITATION_ACCEPT_FAILED');
        return of(undefined);
      }),
    );
  }

  declineInvitation(): Observable<void> {
    const body = { response: 'decline' };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken}`,
    });
    return this.http.post<void>(`${this.apiUrl}/employees/invitation`, body, { headers }).pipe(
      catchError(_err => {
        this.snackbarService.showError('INVITATION_DECLINE_FAILED');
        return of(undefined);
      }),
    );
  }
}
