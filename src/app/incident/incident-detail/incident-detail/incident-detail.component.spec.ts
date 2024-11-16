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
import { AIAssistenceDialogComponent } from '../ai-assistence-dialog/ai-assistence-dialog.component';
import { LOCALE_ID } from '@angular/core';
import { ClientService } from 'src/app/client/client.service';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';

describe('IncidentDetailComponent', () => {
  let component: IncidentDetailComponent;
  let fixture: ComponentFixture<IncidentDetailComponent>;
  let incidentServiceSpy: jasmine.SpyObj<IncidentService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;

  const locale = 'es-CO';

  beforeEach(async () => {
    registerLocaleData(localeEsCo);
    incidentServiceSpy = jasmine.createSpyObj('IncidentService', [
      'incidentDetail',
      'AISuggestions',
    ]);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['showError']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['loadClientData']);

    clientServiceSpy.loadClientData.and.returnValue(
      of({ id: '1', name: 'Client Name', emailIncidents: 'email@test.com', plan: 'premium' }),
    );

    incidentServiceSpy.incidentDetail.and.returnValue(
      of({
        id: '1',
        name: 'Incident Name',
        channel: 'web',
        reportedBy: {
          id: '2',
          clientId: '123',
          name: 'Reporter Name',
          email: 'reporter@example.com',
          role: 'agent',
          invitationStatus: 'accepted',
        },
        createdBy: {
          id: '3',
          clientId: '123',
          name: 'Creator Name',
          email: 'creator@example.com',
          role: 'admin',
          invitationStatus: 'accepted',
        },
        assignedTo: {
          id: '4',
          clientId: '123',
          name: 'Assignee Name',
          email: 'assignee@example.com',
          role: 'analyst',
          invitationStatus: 'accepted',
        },
        history: [
          {
            seq: 1,
            date: '2023-01-01',
            action: 'created',
            description: 'Incident was created.',
          },
          {
            seq: 2,
            date: '2023-01-02',
            action: 'escalated',
            description: 'Incident was escalated.',
          },
        ],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [IncidentDetailComponent],
      providers: [
        { provide: IncidentService, useValue: incidentServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LOCALE_ID, useValue: locale },
        { provide: ClientService, useValue: clientServiceSpy },
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
      history: [{ seq: 1, date: '2023-01-01', action: 'created', description: 'Incident created' }],
    };

    incidentServiceSpy.incidentDetail.and.returnValue(of(mockIncident));

    fixture.detectChanges();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
    expect(incidentServiceSpy.incidentDetail).toHaveBeenCalledWith('1');
    expect(component.incidentDetail).toEqual(mockIncident);
    expect(component.incidentStatus).toBe('created');
    expect(component.incidentDescription).toBe('Incident created');
    expect(component.incidentCreatedDate).toBe('2023-01-01');
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should show error when incidentDetail fails', () => {
    const error = new Error('Loading incident details');
    incidentServiceSpy.incidentDetail.and.returnValue(throwError(() => error));

    fixture.detectChanges();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
    expect(snackbarServiceSpy.showError).toHaveBeenCalled();
  });

  it('should open AI assistance dialog', () => {
    const incidentId = '1';
    const mockData = {
      suggestions: ['Try restarting the system'],
      steps: [
        { text: 'Step 1: Check the system logs', detail: 'Look for any errors in the logs.' },
        {
          text: 'Step 2: Restart the service',
          detail: 'Restart the affected service to resolve the issue.',
        },
      ],
    };

    incidentServiceSpy.AISuggestions.and.returnValue(of(mockData));

    component.openAIAsistenceDialog(incidentId);

    expect(incidentServiceSpy.AISuggestions).toHaveBeenCalledWith(incidentId, locale);
    expect(dialogSpy.open).toHaveBeenCalledWith(AIAssistenceDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '800px',
      data: mockData,
    });
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
    const incidentId = '1';
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ChangeStatusComponent>>(['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    spyOn(component, 'getIncidentDetail');

    component.openChangeStatusDialog(incidentId);

    expect(dialogSpy.open).toHaveBeenCalledWith(ChangeStatusComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: { incidentId },
    });
    expect(component.getIncidentDetail).toHaveBeenCalledWith(incidentId);
  });

  it('should load client info on init', () => {
    const mockClientData = {
      id: '123',
      name: 'Test Client',
      emailIncidents: 'test@example.com',
      plan: 'premium',
    };
    clientServiceSpy.loadClientData.and.returnValue(of(mockClientData));

    fixture.detectChanges();

    expect(clientServiceSpy.loadClientData).toHaveBeenCalledWith(true);
    expect(component.clientPlan).toBe('premium');
  });

  it('should return the last escalated date from history', () => {
    const history: IncidentHistory[] = [
      { seq: 1, date: '2023-01-01', action: 'created', description: 'Created incident' },
      { seq: 2, date: '2023-01-02', action: 'escalated', description: 'Incident escalated' },
      { seq: 3, date: '2023-01-03', action: 'escalated', description: 'Incident escalated again' },
    ];

    const result = component.getEscalatedDate(history);
    expect(result).toBe('2023-01-03');
  });

  it('should return an empty string if there are no escalated actions', () => {
    const history: IncidentHistory[] = [
      { seq: 1, date: '2023-01-01', action: 'created', description: 'Created incident' },
      { seq: 2, date: '2023-01-02', action: 'closed', description: 'Incident closed' },
    ];

    const result = component.getEscalatedDate(history);
    expect(result).toBe('');
  });

  it('should set clientPlan to null if data.plan is not provided', () => {
    const mockClientData = { id: '1', name: 'Client Name', emailIncidents: 'test@example.com' };
    clientServiceSpy.loadClientData.and.returnValue(of(mockClientData));

    component.getClientInfo();

    expect(component.clientPlan).toBeNull();
  });

  it('should set incidentStatus to the previous action if last action is AI_response', () => {
    const mockIncident: Incident = {
      id: '1',
      name: 'Test Incident',
      channel: 'web',
      reportedBy: { id: '1', name: 'Reporter', email: 'reporter@example.com', clientId: '123' },
      createdBy: { id: '1', name: 'Creator', email: 'creator@example.com', clientId: '123' },
      assignedTo: { id: '1', name: 'Assignee', email: 'assignee@example.com', clientId: '123' },
      history: [
        { seq: 1, date: '2023-01-01', action: 'created', description: 'Created incident' },
        { seq: 2, date: '2023-01-02', action: 'escalated', description: 'Incident escalated' },
        { seq: 3, date: '2023-01-03', action: 'AI_response', description: 'AI response provided' },
      ],
    };

    incidentServiceSpy.incidentDetail.and.returnValue(of(mockIncident));

    component.getIncidentDetail('1');

    expect(component.incidentStatus).toBe('escalated');
  });
});
