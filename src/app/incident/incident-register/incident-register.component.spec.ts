import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IncidentRegisterComponent } from './incident-register.component';
import { SnackbarService } from '../../services/snackbar.service';
import { IncidentService, UserNotFoundError } from '../incident.service';
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
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let mockIncidentService: jasmine.SpyObj<IncidentService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess', 'showError']);
    mockIncidentService = jasmine.createSpyObj('IncidentService', ['registerIncident']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, IncidentRegisterComponent],
      providers: [
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

  it('should mark all fields as touched when form is invalid', () => {
    component.onSubmit();
    expect(component.incidenteForm.touched).toBeTruthy();
  });

  it('should register incident', () => {
    const incidentResponse: IncidentResponse = {
      client_id: faker.string.uuid(),
      name: faker.lorem.words(3),
      channel: 'web',
      reported_by: faker.string.uuid(),
      created_by: faker.string.uuid(),
      description: faker.lorem.words(10),
    };

    component.incidenteForm.setValue({
      name: incidentResponse.name,
      email: faker.internet.email(),
      description: incidentResponse.description,
    });

    mockIncidentService.registerIncident.and.returnValue(of(incidentResponse));

    component.onSubmit();

    expect(mockIncidentService.registerIncident).toHaveBeenCalled();
    expect(mockSnackbarService.showSuccess).toHaveBeenCalled();
  });

  it('should show error when user is not found', () => {
    const incidentResponse: IncidentResponse = {
      client_id: faker.string.uuid(),
      name: faker.lorem.words(3),
      channel: 'web',
      reported_by: faker.string.uuid(),
      created_by: faker.string.uuid(),
      description: faker.lorem.words(10),
    };

    component.incidenteForm.setValue({
      name: incidentResponse.name,
      email: faker.internet.email(),
      description: incidentResponse.description,
    });

    mockIncidentService.registerIncident.and.returnValue(throwError(() => new UserNotFoundError()));

    component.onSubmit();

    expect(mockSnackbarService.showError).toHaveBeenCalled();
  });
});
