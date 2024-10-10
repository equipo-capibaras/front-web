import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UserLoginComponent } from './user-login.component';
import { UserServiceService } from '../user-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let userServiceSpy: jasmine.SpyObj<UserServiceService>;
  let router: Router;

  beforeEach(async () => {
    // Crear spies para UserServiceService y Router
    const userServiceMock = jasmine.createSpyObj('UserServiceService', ['login']);

    await TestBed.configureTestingModule({
      imports: [UserLoginComponent, RouterTestingModule, BrowserAnimationsModule],
      providers: [{ provide: UserServiceService, useValue: userServiceMock }, JwtHelperService],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserServiceService) as jasmine.SpyObj<UserServiceService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();
  });

  afterEach(() => {
    // Limpiar sesión después de cada prueba
    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set token and userId on successful login', () => {
    const mockResponse = { token: 'test-token' };
    const decodedToken = { id: '123' };

    spyOn(component.helper, 'decodeToken').and.returnValue(decodedToken); // Simulamos la decodificación del token
    userServiceSpy.login.and.returnValue(of(mockResponse)); // Simulamos una respuesta exitosa del login

    component.loginUser('testuser', 'password123');
    expect(userServiceSpy.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(sessionStorage.getItem('token')).toBe('test-token');
    expect(sessionStorage.getItem('userId')).toBe('123');
    expect(router.navigate).toHaveBeenCalledWith(['/alarms']); // Verificamos que el router navegó
  });

  it('should show error when fields are empty', () => {
    component.loginUser('', ''); // Simulamos campos vacíos
    expect(component.errorUsername).toBe('Este campo es obligatorio');
    expect(component.errorPassword).toBe('Este campo es obligatorio');
    expect(userServiceSpy.login).not.toHaveBeenCalled(); // El login no debe llamarse
  });

  it('should show "required" error message for username when field is touched and empty', () => {
    const usernameControl = component.loginForm.get('username');

    // Simular que el campo ha sido tocado sin ingresar valor
    usernameControl?.markAsTouched();
    usernameControl?.setValue('');
    component.updateErrors();

    expect(component.genericErrorUsername).toBe('Este campo es obligatorio');
    expect(component.showUsernameError).toBeTrue();
  });

  it('should show "invalid email" error message for username when email is invalid', () => {
    const usernameControl = component.loginForm.get('username');

    // Simular que el campo tiene un valor no válido como email
    usernameControl?.setValue('invalid-email');
    usernameControl?.markAsTouched();
    component.updateErrors();

    expect(component.genericErrorUsername).toBe('Debe ser un correo electrónico válido');
    expect(component.showUsernameError).toBeTrue();
  });

  it('should not show any error message for valid username', () => {
    const usernameControl = component.loginForm.get('username');

    // Simular que el campo tiene un valor válido
    usernameControl?.setValue('user@mail.com');
    usernameControl?.markAsTouched();
    component.updateErrors();

    expect(component.showUsernameError).toBeFalse();
  });

  it('should show "required" error message for password when field is touched and empty', () => {
    const passwordControl = component.loginForm.get('password');

    // Simular que el campo ha sido tocado sin ingresar valor
    passwordControl?.markAsTouched();
    passwordControl?.setValue('');
    component.updateErrors();

    expect(component.showPasswordError).toBeTrue();
  });

  it('should not show any error message for valid password', () => {
    const passwordControl = component.loginForm.get('password');

    // Simular que el campo tiene un valor válido
    passwordControl?.setValue('password123');
    passwordControl?.markAsTouched();
    component.updateErrors();

    expect(component.showPasswordError).toBeFalse();
  });

  it('should call updateErrors when form values change', () => {
    spyOn(component, 'updateErrors');

    // Simular un cambio en el valor del formulario
    component.loginForm.get('username')?.setValue('newuser@mail.com');

    expect(component.updateErrors).toHaveBeenCalled();
  });
});
