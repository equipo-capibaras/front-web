import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { EmployeeRegisterComponent } from './employee-register.component';

describe('EmployeeRegisterComponent', () => {
  let component: EmployeeRegisterComponent;
  let fixture: ComponentFixture<EmployeeRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRegisterComponent, NoopAnimationsModule],
      providers: [provideRouter([])],
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
});
