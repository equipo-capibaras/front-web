import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { IncidentListComponent } from './incident-list.component';
import { IncidentService } from '../incident.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';

describe('IncidentListComponent', () => {
  let component: IncidentListComponent;
  let fixture: ComponentFixture<IncidentListComponent>;
  let incidentService: jasmine.SpyObj<IncidentService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    incidentService = jasmine.createSpyObj('IncidentService', ['loadIncidents']);
    loadingService = jasmine.createSpyObj('LoadingService', ['setLoading']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showError']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [IncidentListComponent, NoopAnimationsModule],
      providers: [
        { provide: IncidentService, useValue: incidentService },
        { provide: LoadingService, useValue: loadingService },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  }));

  function setupComponent() {
    fixture = TestBed.createComponent(IncidentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create and load incidents', () => {
    incidentService.loadIncidents.and.returnValue(
      of({
        incidents: [
          {
            id: faker.string.uuid(),
            name: 'Cobro incorrecto',
            reportedBy: {
              id: faker.string.uuid(),
              name: faker.person.fullName(),
              email: faker.internet.email(),
            },
            filingDate: faker.date.past(),
            status: faker.helpers.arrayElement(['created', 'escalated', 'closed']),
          },
        ],
        totalPages: 1,
        currentPage: 1,
        totalIncidents: 1,
      }),
    );

    setupComponent();
    expect(component).toBeTruthy();
  });

  it('should show error when loadIncidents fails', () => {
    const error = new Error('Error loading incidents');
    incidentService.loadIncidents.and.returnValue(throwError(() => error));

    setupComponent();

    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    expect(snackbarService.showError).toHaveBeenCalled();
    expect(loadingService.setLoading).toHaveBeenCalledWith(false);
  });
});
