import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteEmployeeDialogComponent } from './invite-employee-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientResponse, ClientService, DuplicateEmployeeExistError } from '../client.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DialogService } from './dialog.services';
import { provideHttpClient } from '@angular/common/http';

describe('InviteEmployeeDialogComponent', () => {
  let component: InviteEmployeeDialogComponent;
  let fixture: ComponentFixture<InviteEmployeeDialogComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<InviteEmployeeDialogComponent>>;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(() => {
    clientService = jasmine.createSpyObj('ClientService', ['inviteUser', 'getRoleByEmail']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess', 'showError']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogService = jasmine.createSpyObj('DialogService', ['closeAllDialogs']);

    TestBed.configureTestingModule({
      imports: [InviteEmployeeDialogComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ClientService, useValue: clientService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: DialogService, useValue: dialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteEmployeeDialogComponent);
    component = fixture.componentInstance;

    clientService.getRoleByEmail.and.returnValue(
      of({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        clientId: '123',
        invitationStatus: 'accepted',
        invitationDate: new Date().toISOString(),
      }),
    );

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form correctly', () => {
    expect(component.inviteForm.valid).toBeFalse();
    component.inviteForm.controls['email'].setValue('test@example.com');
    expect(component.inviteForm.valid).toBeTrue();
  });

  it('should not invite user if form is invalid', () => {
    component.inviteForm.controls['email'].setValue('');
    component.inviteUser();
    expect(clientService.inviteUser).not.toHaveBeenCalled();
  });

  it('should show error message when getting role by email fails', () => {
    const email = 'mariana@globalcom.ec';
    component.inviteForm.controls['email'].setValue(email);

    clientService.getRoleByEmail.and.returnValue(
      throwError(() => new Error('Error retrieving role')),
    );

    component.inviteUser();

    expect(snackbarService.showError).toHaveBeenCalledWith('Error retrieving role');
  });

  it('should close the dialog when cancel is called', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close all dialogs when canceling this dialog', () => {
    component.onCancelThis();
    expect(dialogService.closeAllDialogs).toHaveBeenCalled();
  });

  it('should handle errors when inviting user', () => {
    const email = 'test@example.com';
    component.inviteForm.controls['email'].setValue(email);

    clientService.getRoleByEmail.and.returnValue(
      of({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        clientId: '123',
        invitationStatus: 'accepted',
        invitationDate: new Date().toISOString(),
      }),
    );

    clientService.inviteUser.and.returnValue(throwError(() => new DuplicateEmployeeExistError()));

    component.inviteUser();
    component.onConfirmInvite(email);

    expect(snackbarService.showError).toHaveBeenCalledWith('Empleado ya vinculado a tu empresa.');
  });

  it('should open confirmation dialog with correct email and role', () => {
    const email = 'john@example.com';
    component.inviteForm.controls['email'].setValue(email);

    spyOn(component, 'openConfirmationDialog');

    component.inviteUser();

    expect(component.openConfirmationDialog).toHaveBeenCalledWith(email, 'Admin');
  });

  it('should invite user successfully and show success message', () => {
    const email = 'john@example.com';
    component.inviteForm.controls['email'].setValue(email);

    clientService.getRoleByEmail.and.returnValue(
      of({
        id: '1',
        name: 'John Doe',
        email,
        role: 'Admin',
        clientId: '123',
        invitationStatus: 'accepted',
        invitationDate: new Date().toISOString(),
      }),
    );

    const mockClientResponse: ClientResponse = {
      id: '123',
      name: 'John Doe',
      emailIncidents: email,
      plan: 'basic',
    };

    clientService.inviteUser.and.returnValue(of(mockClientResponse));

    spyOn(component, 'reloadPage');

    component.inviteUser();
    component.onConfirmInvite(email);

    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogService.closeAllDialogs).toHaveBeenCalled();
    expect(snackbarService.showSuccess).toHaveBeenCalledWith('Empleado invitado exitosamente.');
    expect(component.reloadPage).toHaveBeenCalled();
  });

  it('should initialize the form with the correct controls', () => {
    expect(component.inviteForm).toBeDefined();
    expect(component.inviteForm.controls['email']).toBeDefined();
  });
});
