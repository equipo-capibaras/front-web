import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { EmployeeRegisterComponent } from './employee-register.component';
import { AuthService } from '../../auth/auth.service';
import { DuplicateEmailError, EmployeeResponse, EmployeeService } from '../employee.service';
import { Role } from '../../auth/role';

describe('EmployeeRegisterComponent', () => {
  let component: EmployeeRegisterComponent;
  let fixture: ComponentFixture<EmployeeRegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['getRole', 'login']);
    employeeService = jasmine.createSpyObj('EmployeeService', ['register']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [EmployeeRegisterComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: EmployeeService, useValue: employeeService },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error for password mismatch', () => {
    const passwordControl = component.registerForm.get('password');
    const passwordConfirmationControl = component.registerForm.get('passwordConfirmation');

    passwordControl?.setValue('password123');
    passwordConfirmationControl?.setValue('differentPassword');
    expect(passwordControl?.hasError('passwordMismatch')).toBeTruthy();
    expect(passwordConfirmationControl?.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should give no error for matching passwords', () => {
    const passwordControl = component.registerForm.get('password');
    const passwordConfirmationControl = component.registerForm.get('passwordConfirmation');

    passwordControl?.setValue('password123');
    passwordConfirmationControl?.setValue('password123');
    expect(passwordControl?.hasError('passwordMismatch')).toBeFalsy();
    expect(passwordConfirmationControl?.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should mark all fields as touched on invalid submit', () => {
    component.register();
    expect(component.registerForm.touched).toBeTruthy();
  });

  for (const role of Object.values(Role)) {
    it('should register a employee', () => {
      component.register();

      const name = faker.person.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      component.registerForm.setValue({
        name: name,
        email: email,
        role: role,
        password: password,
        passwordConfirmation: password,
      });

      const mockResponse: EmployeeResponse = {
        id: faker.string.uuid(),
        clientId: null,
        name: name,
        email: email,
        role: role,
        invitationStatus: 'pending',
        invitationDate: faker.date.past(),
      };

      employeeService.register.and.returnValue(of(mockResponse));
      authService.getRole.and.returnValue(role);
      authService.login.and.returnValue(of(true));

      component.register();

      expect(employeeService.register).toHaveBeenCalledWith({
        name: name,
        email: email,
        role: role,
        password: password,
      });
    });
  }

  it('should show error snackbar on duplicate email error', () => {
    component.register();

    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    component.registerForm.setValue({
      name: name,
      email: email,
      role: faker.helpers.arrayElement(Object.values(Role)),
      password: password,
      passwordConfirmation: password,
    });

    employeeService.register.and.returnValue(throwError(() => new DuplicateEmailError()));

    component.register();

    expect(snackBar.open).toHaveBeenCalled();
  });
});
