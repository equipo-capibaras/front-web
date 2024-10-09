import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeRegisterComponent } from './employee-register.component';
import { RegisterService } from '../register.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmployeeRegisterComponent', () => {
  let component: EmployeeRegisterComponent;
  let fixture: ComponentFixture<EmployeeRegisterComponent>;
  let registerServiceSpy: jasmine.SpyObj<RegisterService>;

  const mockResponse = {
    message: 'Account created successfully',
    token: 'mock-jwt-token',
  };

  beforeEach(async () => {
    registerServiceSpy = jasmine.createSpyObj('RegisterService', ['CreateAccount']);

    await TestBed.configureTestingModule({
      imports: [
        EmployeeRegisterComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule, // Add RouterTestingModule here
      ],
      providers: [{ provide: RegisterService, useValue: registerServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create a new account', () => {
    registerServiceSpy.CreateAccount.and.returnValue(of(mockResponse));

    // Call the method to test
    component.CreateAccount('Test Name', 'test@example.com', 'admin', 'password123', 'password123');

    // Expectations
    expect(registerServiceSpy.CreateAccount).toHaveBeenCalledWith(
      'Test Name',
      'test@example.com',
      'admin',
      'password123',
    );
    // Further assertions can be made based on your component's behavior after successful registration
  });
});
