import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EmployeeRegisterComponent } from './employee-register.component';
import { EmployeeService } from '../employee.service';

describe('EmployeeRegisterComponent', () => {
  let component: EmployeeRegisterComponent;
  let fixture: ComponentFixture<EmployeeRegisterComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: Router;

  beforeEach(async () => {
    employeeService = jasmine.createSpyObj('EmployeeService', ['registerEmployee']);

    await TestBed.configureTestingModule({
      imports: [
        EmployeeRegisterComponent,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: EmployeeService, useValue: employeeService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
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
    spyOn(component.registerForm, 'markAllAsTouched');

    component.register();

    expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.registerForm.invalid).toBeTruthy();
  });

  it('should navigate on successful registration', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'admin',
    });

    employeeService.registerEmployee.and.returnValue(of({ success: true }));

    component.register();

    expect(employeeService.registerEmployee).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/company-register']);
  });

  it('should not navigate on registration failure', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'admin',
    });

    employeeService.registerEmployee.and.returnValue(of(false));

    component.register();

    expect(employeeService.registerEmployee).toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
