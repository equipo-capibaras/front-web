import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { InvitationDialogComponent } from './invite-message.component';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/client';

describe('InvitationDialogComponent', () => {
  let component: InvitationDialogComponent;
  let fixture: ComponentFixture<InvitationDialogComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<InvitationDialogComponent>>;

  beforeEach(async () => {
    clientService = jasmine.createSpyObj('ClientService', ['loadClientData']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [InvitationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: ClientService, useValue: clientService },
      ],
    }).compileComponents();
  });

  function setupComponent() {
    const mockClientData: Client = {
      id: '1',
      name: 'Empresa S.A.S',
      plan: 'empresario',
      emailIncidents: 'pqrs-empresa@capibaras.io',
    };

    clientService.loadClientData.and.returnValue(of(mockClientData));

    fixture = TestBed.createComponent(InvitationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setupComponent();

    expect(component).toBeTruthy();
  });

  it('should confirm invitation', () => {
    setupComponent();

    component.onConfirm();

    expect(dialogRef.close).toHaveBeenCalledWith('accepted');
  });

  it('should decline invitation', () => {
    setupComponent();

    component.onDecline();

    expect(dialogRef.close).toHaveBeenCalledWith('declined');
  });
});
