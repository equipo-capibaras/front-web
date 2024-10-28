import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { EmployeeRegisterComponent } from './employee-register.component';
import { AuthService } from '../../auth/auth.service';
import { DuplicateEmailError, EmployeeResponse, EmployeeService } from '../employee.service';
import { Role } from '../../auth/role';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-mock',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class ComponentMock {}

describe('EmployeeRegisterComponent', () => {
  let component: EmployeeRegisterComponent;
  let fixture: ComponentFixture<EmployeeRegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['getRole', 'login']);
    employeeService = jasmine.createSpyObj('EmployeeService', ['register']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showError', 'showSuccess']);

    await TestBed.configureTestingModule({
      imports: [EmployeeRegisterComponent, NoopAnimationsModule],
      providers: [
        provideRouter([
          { path: 'dashboards', component: ComponentMock },
          { path: 'incidents', component: ComponentMock },
          { path: 'client/register', component: ComponentMock },
        ]),
        { provide: AuthService, useValue: authService },
        { provide: EmployeeService, useValue: employeeService },
        { provide: SnackbarService, useValue: snackbarService },
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
    it('should register a employee', waitForAsync(() => {
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
    }));
  }

  it('should show error snackbar on duplicate email error', waitForAsync(() => {
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

    expect(snackbarService.showError).toHaveBeenCalled();
  }));
});
