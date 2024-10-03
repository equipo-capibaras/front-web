/* tslint:disable:no-unused-variable */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { UserServiceService } from './user-service.service';
import { environment } from '../../environments/environment';

describe('Service: UserService', () => {
  let service: UserServiceService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserServiceService]
    });
    service = TestBed.inject(UserServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should initiate service', inject([UserServiceService], (service: UserServiceService) => {
    expect(service).toBeTruthy();
  }));

   /**
   * Prueba unitaria para verificar si el método `login` hace la solicitud HTTP POST correctamente.
   */
   it('should log in a user via POST', () => {
    const mockResponse = { token: '12345' };  // Respuesta simulada
    const username = 'testuser';
    const password = 'password123';

    service.login(username, password).subscribe((response) => {
      expect(response).toEqual(mockResponse);  // Verifica que la respuesta sea la esperada
    });

    const req = httpTestingController.expectOne(`${apiUrl}/auth/employee`);
    expect(req.request.method).toBe('POST');  // Verifica que el método HTTP sea POST
    expect(req.request.body).toEqual({ username, password });  // Verifica el cuerpo de la solicitud

    // Simula una respuesta exitosa del servidor
    req.flush(mockResponse);
  });

  /**
   * Prueba unitaria para manejar el caso de error en la solicitud de login.
   */
  it('should handle login error', () => {
    const username = 'wronguser';
    const password = 'wrongpassword';

    service.login(username, password).subscribe(
      () => fail('Debería haber fallado con un error 401'),
      (error) => {
        expect(error.status).toBe(401);  // Verifica que el error sea 401 (no autorizado)
      }
    );

    const req = httpTestingController.expectOne(`${apiUrl}/auth/employee`);
    expect(req.request.method).toBe('POST');

    // Simula una respuesta de error del servidor
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});
