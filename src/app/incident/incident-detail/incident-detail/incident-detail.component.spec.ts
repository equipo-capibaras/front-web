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

  [1, 2, 3, 4].forEach(seq => {
    it(`should load incident details on init ${seq}`, () => {
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

      if (seq === 4) {
        mockIncident.history = mockIncident.history.filter(h => h.seq !== 2);
      } else {
        mockIncident.history = mockIncident.history.slice(0, seq);
      }

      console.log(mockIncident.history);

      incidentServiceSpy.incidentDetail.and.returnValue(of(mockIncident));

      fixture.detectChanges();

      expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
      expect(incidentServiceSpy.incidentDetail).toHaveBeenCalledWith('1');
      expect(component.incidentDetail).toEqual(mockIncident);
      if (seq === 1) {
        expect(component.incidentStatus).toBe('created');
      } else if (seq === 2) {
        expect(component.incidentStatus).toBe('escalated');
      } else if (seq > 3) {
        expect(component.incidentStatus).toBe('closed');
      }
      expect(component.incidentDescription).toBe('Incident created');
      expect(component.incidentCreatedDate).toBe('2023-01-01');
      if (seq > 1 && seq < 4) {
        expect(component.incidentEscalatedDate).toBe('2023-01-02');
      } else {
        expect(component.incidentEscalatedDate).toBe('');
      }
      if (seq >= 3) {
        expect(component.incidentClosedDate).toBe('2023-01-03');
      } else {
        expect(component.incidentClosedDate).toBe('');
      }
      expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
    });
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

  it('should open change status dialog', () => {
    const incidentId = faker.string.uuid();

    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ChangeStatusComponent>>(['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    component.getIncidentDetail = jasmine.createSpy();

    component.openChangeStatusDialog(incidentId);

    expect(dialogSpy.open).toHaveBeenCalledWith(ChangeStatusComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: { incidentId },
    });

    expect(component.getIncidentDetail).toHaveBeenCalledWith(incidentId);
  });
});
