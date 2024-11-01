import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IncidentRegisterComponent } from './incident-register.component';
import { AuthService } from '../../auth/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { IncidentService } from '../incident.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Import this module

export interface IncidentResponse {
  client_id: string;
  name: string;
  channel: string;
  reported_by: string;
  created_by: string;
  description: string;
}

describe('IncidentRegisterComponent', () => {
  let component: IncidentRegisterComponent;
  let fixture: ComponentFixture<IncidentRegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let mockIncidentService: jasmine.SpyObj<IncidentService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['refreshToken']);
    mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess', 'showError']);
    mockIncidentService = jasmine.createSpyObj('IncidentService', ['incidentRegister']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule, // Add this line
        IncidentRegisterComponent,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: IncidentService, useValue: mockIncidentService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.incidenteForm).toBeDefined();
    expect(component.incidenteForm.valid).toBeFalsy(); // Initial form is invalid
    expect(component.name).toBeTruthy();
    expect(component.email).toBeTruthy();
    expect(component.description).toBeTruthy();
  });

  it('should mark all fields as touched when form is invalid', () => {
    component.onSubmit();
    expect(component.incidenteForm.touched).toBeTruthy();
  });

  /*
  it('should submit the form and navigate on success', () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const description = faker.lorem.sentence();
    const mockResponse: IncidentResponse = {
      client_id: faker.string.uuid(),
      name: name,
      channel: 'web',
      reported_by: email,
      created_by: email,
      description: description,
    };

    component.incidenteForm.setValue({
      name: name,
      email: email,
      description: description,
    });

    mockIncidentService.incidentRegister.and.returnValue(of(mockResponse));
    mockAuthService.refreshToken.and.returnValue(of(true));

    component.onSubmit();

    expect(mockSnackbarService.showSuccess).toHaveBeenCalledWith(
      $localize`:@@clientRegisterSuccess:Incidente creado exitosamente`,
    );
    expect(mockAuthService.refreshToken).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error message on incident registration failure', () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const description = faker.lorem.sentence();

    component.incidenteForm.setValue({
      name: name,
      email: email,
      description: description,
    });

    mockIncidentService.incidentRegister.and.returnValue(throwError(new Error('Error occurred')));

    component.onSubmit();

    expect(mockSnackbarService.showError).toHaveBeenCalledWith(
      $localize`:@@ErrorIncidentError:Error`,
    );
  });*/
});
