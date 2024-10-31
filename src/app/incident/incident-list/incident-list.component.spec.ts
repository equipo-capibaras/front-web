import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { faker } from '@faker-js/faker';
import { IncidentListComponent } from './incident-list.component';
import { EmployeeService } from '../../employee/employee.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('IncidentListComponent', () => {
  let component: IncidentListComponent;
  let fixture: ComponentFixture<IncidentListComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(async () => {
    employeeService = jasmine.createSpyObj('EmployeeService', ['loadIncidents']);

    await TestBed.configureTestingModule({
      imports: [IncidentListComponent, NoopAnimationsModule],
      providers: [{ provide: EmployeeService, useValue: employeeService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentListComponent);
    component = fixture.componentInstance;
  });

  function setupComponent() {
    fixture = TestBed.createComponent(IncidentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create and load incidents', () => {
    employeeService.loadIncidents.and.returnValue(
      of({
        incidents: [
          {
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

  it('should handle empty incident list correctly', fakeAsync(() => {
    employeeService.loadIncidents.and.returnValue(
      of({
        incidents: [],
        totalPages: 1,
        currentPage: 1,
        totalIncidents: 0,
      }),
    );

    component.loadIncidents(5, 1);
    tick();

    fixture.detectChanges();

    // Expectations
    expect(component.incidentsList.data.length).toBe(0);
    expect(component.totalIncidents).toBe(0);
  }));

  it('should set isLoading correctly', fakeAsync(() => {
    employeeService.loadIncidents.and.returnValue(
      of({
        incidents: [],
        totalPages: 1,
        currentPage: 1,
        totalIncidents: 0,
      }),
    );

    component.loadIncidents(5, 1);
    expect(component.isLoading).toBeFalse();

    tick();

    expect(component.isLoading).toBeFalse();
  }));
});
