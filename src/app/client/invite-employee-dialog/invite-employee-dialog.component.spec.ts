import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteEmployeeDialogComponent } from './invite-employee-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DialogService } from './dialog.services';

describe('InviteEmployeeDialogComponent', () => {
  let component: InviteEmployeeDialogComponent;
  let fixture: ComponentFixture<InviteEmployeeDialogComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<InviteEmployeeDialogComponent>>;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(() => {
    // Mocking services
    clientService = jasmine.createSpyObj('ClientService', ['inviteUser', 'getRoleByEmail']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess', 'showError']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogService = jasmine.createSpyObj('DialogService', ['closeAllDialogs']);

    TestBed.configureTestingModule({
      imports: [
        InviteEmployeeDialogComponent, // Use imports for standalone component
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
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

  it('should not invite user if form is invalid', () => {
    component.inviteForm.controls['email'].setValue('');
    component.inviteUser();
    expect(clientService.inviteUser).not.toHaveBeenCalled();
  });

  it('should show error message when getting role by email fails', () => {
    const email = 'mariana@globalcom.ec';
    component.inviteForm.controls['email'].setValue(email);

    // Mock the getRoleByEmail to return an error
    clientService.getRoleByEmail.and.returnValue(
      throwError(() => new Error('Error retrieving role')),
    );

    // Invoke the inviteUser method
    component.inviteUser();

    // Expect the error snackbar to be shown
    expect(snackbarService.showError).toHaveBeenCalledWith('Error retrieving role');
  });

  it('should close the dialog when cancel is called', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog when cancel is called', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close all dialogs when canceling this dialog', () => {
    component.onCancelThis();
    expect(dialogService.closeAllDialogs).toHaveBeenCalled();
  });
});
