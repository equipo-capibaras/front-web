import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { faker } from '@faker-js/faker';
import { LoadingService } from 'src/app/services/loading.service';
import { IncidentService } from '../../incident.service';
import { Incident, IncidentHistory } from '../../incident';
import { IncidentDetailComponent } from './incident-detail.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeStatusComponent } from '../../change-status/change-status.component';

describe('IncidentDetailComponent', () => {
  let component: IncidentDetailComponent;
  let fixture: ComponentFixture<IncidentDetailComponent>;
  let incidentServiceSpy: jasmine.SpyObj<IncidentService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    incidentServiceSpy = jasmine.createSpyObj('IncidentService', ['incidentDetail']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['showError']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [IncidentDetailComponent],
      providers: [
        { provide: IncidentService, useValue: incidentServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load incident details on init', () => {
    const mockIncident: Incident = {
      id: '1',
      name: 'Test Incident',
      channel: 'web',
      reportedBy: {
        id: faker.string.uuid(),
        name: 'John Doe',
        email: faker.internet.email(),
        clientId: '',
        role: 'agent',
        invitationStatus: 'accepted',
        invitationDate: '',
      },
      createdBy: {
        id: faker.string.uuid(),
        name: 'Jane Doe',
        email: faker.internet.email(),
        clientId: '',
      },
      assignedTo: {
        id: faker.string.uuid(),
        name: 'Agent Smith',
        email: faker.internet.email(),
        clientId: '',
        role: 'agent',
        invitationStatus: 'accepted',
        invitationDate: '',
      },
      history: [
        { seq: 1, date: '2023-01-01', action: 'created', description: 'Incident created' },
        { seq: 2, date: '2023-01-02', action: 'escalated', description: 'Incident escalated' },
        { seq: 3, date: '2023-01-03', action: 'closed', description: 'Incident closed' },
      ],
    };

    incidentServiceSpy.incidentDetail.and.returnValue(of(mockIncident));

    fixture.detectChanges();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
    expect(incidentServiceSpy.incidentDetail).toHaveBeenCalledWith('1');
    expect(component.incidentDetail).toEqual(mockIncident);
    expect(component.incidentStatus).toBe('closed');
    expect(component.incidentDescription).toBe('Incident created');
    expect(component.incidentCreatedDate).toBe('2023-01-01');
    expect(component.incidentEscalatedDate).toBe('2023-01-02');
    expect(component.incidentClosedDate).toBe('2023-01-03');
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should show error when incidentDetail fails', () => {
    const error = new Error('Loading incident details');
    incidentServiceSpy.incidentDetail.and.returnValue(throwError(() => error));

    fixture.detectChanges();
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
    expect(snackbarServiceSpy.showError).toHaveBeenCalled();
  });

  it('should return the escalated date from history', () => {
    const history: IncidentHistory[] = [
      { seq: 1, date: '2023-01-01', action: 'created', description: 'Incident created' },
      { seq: 2, date: '2023-01-02', action: 'escalated', description: 'Incident escalated' },
    ];

    const escalatedDate = component.getEscalatedDate(history);
    expect(escalatedDate).toBe('2023-01-02');
  });

  it('should return the closed date from history', () => {
    const history: IncidentHistory[] = [
      { seq: 1, date: '2023-01-01', action: 'created', description: 'Incident created' },
      { seq: 3, date: '2023-01-03', action: 'closed', description: 'Incident closed' },
    ];

    const closedDate = component.getClosedDate(history);
    expect(closedDate).toBe('2023-01-03');
  });

  it('should open ChangeStatus dialog with correct incidentId', () => {
    const incidentId = '1';
    const mockResult = { status: 'Escalado', comment: 'Updated status' };

    const dialogRefMock = {
      afterClosed: () => of(mockResult),
    };

    dialogSpy.open.and.returnValue(dialogRefMock as MatDialogRef<ChangeStatusComponent>);

    component.openChangeStatusDialog(incidentId);

    expect(dialogSpy.open).toHaveBeenCalledWith(ChangeStatusComponent, {
      width: '600px',
      data: { incidentId },
    });

    dialogRefMock.afterClosed().subscribe(result => {
      expect(result).toEqual(mockResult);
      console.log('Cambio de estado:', result);
    });
  });
});
