import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { UserServiceService } from './user-service.service';
import { environment } from 'src/environments/environment';

describe('Service: UserService', () => {
  let service: UserServiceService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserServiceService],
    });
    service = TestBed.inject(UserServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should initiate service', () => {
    const service = TestBed.inject(UserServiceService);
    expect(service).toBeTruthy();
  });

  /**
   * Prueba unitaria para verificar si el método `login` hace la solicitud HTTP POST correctamente.
   */
  it('should log in a user via POST', () => {
    const mockResponse = { token: '12345' }; // Respuesta simulada
    const username = 'testuser';
    const password = 'password123';

    service.login(username, password).subscribe(response => {
      expect(response).toEqual(mockResponse); // Verifica que la respuesta sea la esperada
    });

    const req = httpTestingController.expectOne(`${apiUrl}/auth/employee`);
    expect(req.request.method).toBe('POST'); // Verifica que el método HTTP sea POST
    expect(req.request.body).toEqual({ username, password }); // Verifica el cuerpo de la solicitud

    // Simula una respuesta exitosa del servidor
    req.flush(mockResponse);
  });
});
