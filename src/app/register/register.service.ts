import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * Método para crear una cuenta.
   * @param nombre El nombre de empresa.
   * @param correo corre de la empresa.
   * @param Rol Que rol desempeña.
   * @param contraseña contraseña.
   * @param Confirmar contraseña Confirmar contraseña.
   * @returns Un observable con la respuesta del servidor.
   */
  CreateAccount(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/company`, { name, email, password });
  }
}
