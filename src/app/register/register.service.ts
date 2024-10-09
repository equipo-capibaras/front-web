import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

// Define the interfaces for request and response types
interface CreateAccountRequest {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface CreateAccountResponse {
  message: string; // Adjust based on your actual API response
  token?: string; // Optional if token is returned
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  // Use environment variable for API URL
  private apiUrl = '/api/v1'; // You can replace this with environment.apiUrl

  constructor(private http: HttpClient) {}

  /**
   * Método para crear una cuenta.
   * @param name El nombre de empresa.
   * @param email Correo de la empresa.
   * @param role El rol (Admin).
   * @param password Contraseña.
   * @returns Un observable con la respuesta del servidor.
   */
  CreateAccount(
    name: string,
    email: string,
    role: string,
    password: string,
  ): Observable<CreateAccountResponse> {
    const requestBody: CreateAccountRequest = { name, email, role, password };

    return this.http
      .post<CreateAccountResponse>(`${this.apiUrl}/auth/employee`, requestBody)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
