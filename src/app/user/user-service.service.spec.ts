/* tslint:disable:no-unused-variable */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { UserServiceService } from './user-service.service';

describe('Service: UserService', () => {
  let service: UserServiceService;
  let httpTestingController: HttpTestingController;
  const apiUrl = '/api/v1';

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
   * Prueba unitaria para manejar el caso de error en la solicitud de login con error 401.
   */
   it('should handle 401 login error', () => {
    const username = 'wronguser';
    const password = 'wrongpassword';

    service.login(username, password).subscribe(
      () => fail('Debería haber fallado con un error 401'),
      (error) => {
        expect(error.message).toBe('Username or password is incorrect.');  // Verifica el mensaje de error
      }
    );

    const req = httpTestingController.expectOne(`${apiUrl}/auth/employee`);
    expect(req.request.method).toBe('POST');

    // Simula una respuesta de error del servidor
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  /**
   * Prueba unitaria para manejar el caso de error en la solicitud de login con error 500.
   */
  it('should handle 500 login error', () => {
    const username = 'testuser';
    const password = 'password123';

    service.login(username, password).subscribe(
      () => fail('Debería haber fallado con un error 500'),
      (error) => {
        expect(error.message).toBe('Internal server error. Please try again later.');  // Verifica el mensaje de error
      }
    );

    const req = httpTestingController.expectOne(`${apiUrl}/auth/employee`);
    expect(req.request.method).toBe('POST');

    // Simula una respuesta de error del servidor con un error 500
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  /**
   * Prueba unitaria para manejar el caso de error en la solicitud de login con error 403.
   */
  it('should handle 403 login error', () => {
    const username = 'testuser';
    const password = 'password123';

    service.login(username, password).subscribe(
      () => fail('Debería haber fallado con un error 403'),
      (error) => {
        expect(error.message).toBe('You do not have the necessary permissions.');  // Verifica el mensaje de error
      }
    );

    const req = httpTestingController.expectOne(`${apiUrl}/auth/employee`);
    expect(req.request.method).toBe('POST');

    // Simula una respuesta de error del servidor con un error 403
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });
});
