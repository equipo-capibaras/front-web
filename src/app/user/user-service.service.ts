import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Método para autenticar un usuario.
   * @param username El nombre de usuario.
   * @param password La contraseña del usuario.
   * @returns Un observable con la respuesta del servidor.
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/employee`, { username, password }).pipe(
      catchError(this.handleError) // Maneja errores del servidor
    );
  }

  /**
   * Maneja errores en la respuesta HTTP.
   * @param error El error de respuesta HTTP.
   * @returns Un observable que emite el error procesado.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente (ej. red o algo inesperado)
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 401:
          errorMessage = 'Username or password is incorrect.';
          break;
        case 403:
          errorMessage = 'You do not have the necessary permissions.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Unexpected error: ${error.status}. ${error.message}`;
          break;
      }
    }

    // Muestra el error en la consola (opcional)
    console.error(`Error status: ${error.status}, Error: ${error.message}`);

    // Devuelve un observable con un mensaje de error adecuado
    return throwError(() => new Error(errorMessage));
  }
}

