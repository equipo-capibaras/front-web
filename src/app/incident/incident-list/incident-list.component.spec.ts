import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { IncidentListComponent } from './incident-list.component';
import { IncidentService } from '../incident.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';
import { ChangeStatusComponent } from '../change-status/change-status.component';

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

    incidentService.loadIncidents.and.returnValue(
      of({
        incidents: [],
        totalIncidents: 0,
        totalPages: 1,
        currentPage: 1,
      }),
    );

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

  it('should load incidents on page change', () => {
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
        totalIncidents: 1,
        totalPages: 1,
        currentPage: 1,
      }),
    );

    setupComponent();

    const pageEvent = { pageSize: 10, pageIndex: 2 } as PageEvent;
    component.paginator.page.emit(pageEvent);

    expect(component.pageSize).toBe(10);
    expect(component.currentPage).toBe(3);
    expect(incidentService.loadIncidents).toHaveBeenCalledWith(10, 3);
  });

  it('should navigate to incident detail', () => {
    setupComponent();

    const incidentId = faker.string.uuid();
    component.showDetail(incidentId);

    expect(router.navigate).toHaveBeenCalledWith([`/incidents/${incidentId}`]);
  });

  it('should open change status dialog and reload incidents after closing', () => {
    setupComponent();

    const incidentId = faker.string.uuid();
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ChangeStatusComponent>>(['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(null));

    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpy);

    component.openChangeStatusDialog(incidentId);

    expect(component.dialog.open).toHaveBeenCalledWith(ChangeStatusComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: { incidentId },
    });

    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
    expect(incidentService.loadIncidents).toHaveBeenCalledWith(
      component.pageSize,
      component.currentPage,
    );
  });
});
