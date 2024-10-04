import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoginComponent } from './user-login.component';
import { UserServiceService } from '../user-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let userServiceSpy: jasmine.SpyObj<UserServiceService>;
  let router: Router;
//  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Crear spies para UserServiceService y Router
    const userServiceMock = jasmine.createSpyObj('UserServiceService', ['login']);

    await TestBed.configureTestingModule({
      imports: [UserLoginComponent, RouterTestingModule],
      providers: [
        { provide: UserServiceService, useValue: userServiceMock },
        JwtHelperService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserServiceService) as jasmine.SpyObj<UserServiceService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();
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

  it('should handle login error', () => {
    const mockError = { message: 'Username or password is incorrect.' };

    userServiceSpy.login.and.returnValue(throwError(() => mockError)); // Simulamos un error en el login

    component.loginUser('wronguser', 'wrongpassword');
    expect(userServiceSpy.login).toHaveBeenCalledWith('wronguser', 'wrongpassword');
    expect(component.error).toBe('Username or password is incorrect.');
    expect(sessionStorage.getItem('token')).toBe('');
    expect(sessionStorage.getItem('userId')).toBe('');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
