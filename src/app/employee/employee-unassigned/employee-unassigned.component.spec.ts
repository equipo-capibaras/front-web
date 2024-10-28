import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { ClientService } from 'src/app/client/client.service';
import { EmployeeUnassignedComponent } from './employee-unassigned.component';
import { InvitationDialogComponent } from '../invite-message/invite-message.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DialogService } from 'src/app/client/invite-employee-dialog/dialog.services';
import { InviteEmployeeDialogComponent } from 'src/app/client/invite-employee-dialog/invite-employee-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Role } from 'src/app/auth/role';
import { defaultRoutes } from 'src/app/auth/default.routes';

describe('EmployeeUnassignedComponent', () => {
  let component: EmployeeUnassignedComponent;
  let fixture: ComponentFixture<EmployeeUnassignedComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let clientService: jasmine.SpyObj<ClientService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<InviteEmployeeDialogComponent>>;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(() => {
    clientService = jasmine.createSpyObj('ClientService', [
      'inviteUser',
      'getRoleByEmail',
      'acceptInvitation',
      'declineInvitation',
    ]);

    snackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess', 'showError']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogService = jasmine.createSpyObj('DialogService', ['closeAllDialogs']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'refreshToken', 'getRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [InviteEmployeeDialogComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ClientService, useValue: clientService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: DialogService, useValue: dialogService },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeUnassignedComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    authServiceSpy.getToken.and.returnValue('sampleToken');
    authServiceSpy.refreshToken.and.returnValue(of(true));
    authServiceSpy.getRole.and.returnValue(Role.Admin);

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

    clientService.acceptInvitation.and.returnValue(of(undefined));
    clientService.declineInvitation.and.returnValue(of(undefined));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog when openPopup is called', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of('accepted'));

    dialogSpy.open.and.returnValue(dialogRefSpy);
    component.openPopup();
    expect(dialogSpy.open).toHaveBeenCalledWith(InvitationDialogComponent);
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
  });

  it('should accept invitation and navigate based on role', () => {
    const token = 'sampleToken';
    const role = Role.Admin;

    authServiceSpy.getToken.and.returnValue(token);
    authServiceSpy.refreshToken.and.returnValue(of(true));
    authServiceSpy.getRole.and.returnValue(role);

    clientService.acceptInvitation.and.returnValue(of(undefined));

    component.acceptInvitation();

    expect(clientService.acceptInvitation).toHaveBeenCalledWith(token);
    expect(authServiceSpy.refreshToken).toHaveBeenCalled();
    expect(authServiceSpy.getRole).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([defaultRoutes[role]]);
  });

  it('should handle 409 error in acceptInvitation', () => {
    const token = 'sampleToken';
    authServiceSpy.getToken.and.returnValue(token);

    clientService.acceptInvitation.and.returnValue(
      throwError(() => ({ status: 409, message: 'Ya estás vinculado a la organización' })),
    );

    spyOn(console, 'error');

    component.acceptInvitation();

    expect(clientService.acceptInvitation).toHaveBeenCalledWith(token);
    expect(console.error).toHaveBeenCalledWith(
      'Ya estás vinculado a la organización:',
      'Ya estás vinculado a la organización',
    );
  });

  it('should decline invitation successfully', () => {
    const token = 'sampleToken';
    authServiceSpy.getToken.and.returnValue(token);

    clientService.acceptInvitation.and.returnValue(of(undefined));

    component.declineInvitation();

    expect(clientService.declineInvitation).toHaveBeenCalledWith(token);
    expect(component.invitation).toBeNull();
  });

  it('should handle error in declineInvitation', () => {
    const token = 'sampleToken';
    authServiceSpy.getToken.and.returnValue(token);

    clientService.declineInvitation.and.returnValue(
      throwError(() => new Error('Error al rechazar la invitación')),
    );

    spyOn(console, 'error');

    component.declineInvitation();

    expect(clientService.declineInvitation).toHaveBeenCalledWith(token);
    expect(console.error).toHaveBeenCalledWith(
      'Error al rechazar la invitación:',
      jasmine.any(Error),
    );
  });
});
