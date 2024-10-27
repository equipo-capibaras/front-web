import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteEmployeeDialogComponent } from './invite-employee-dialog.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientResponse, ClientService, DuplicateEmployeeExistError } from '../client.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Employee } from 'src/app/employee/employee';

describe('InviteEmployeeDialogComponent', () => {
  let component: InviteEmployeeDialogComponent;
  let fixture: ComponentFixture<InviteEmployeeDialogComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<InviteEmployeeDialogComponent>>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockResponse: Employee = {
    id: '1dabcf78-e62a-41fd-b69c-fd7c775b04d4',
    clientId: '22128c04-0c2c-4633-8317-0fffd552f7a6',
    name: 'Mariana Sanchez Torres',
    email: 'mariana@globalcom.ec',
    role: 'analyst',
    invitationStatus: 'accepted',
    invitationDate: '2024-10-12T16:32:48+00:00',
  };

  const ClientResponseClient: ClientResponse = {
    id: '1dabcf78-e62a-41fd-b69c-fd7c775b04d4',
    name: 'Mariana Sanchez Torres',
    emailIncidents: 'mariana@globalcom.ec',
    invitationStatus: 'accepted',
    invitationDate: '2024-10-12T16:32:48+00:00',
  };

  beforeEach(async () => {
    clientService = jasmine.createSpyObj('ClientService', ['inviteUser']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess', 'showError']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    authService = jasmine.createSpyObj('AuthService', ['getRole']);

    await TestBed.configureTestingModule({
      imports: [
        InviteEmployeeDialogComponent, // Mueve el componente aquí
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule, // Required to mock HTTP requests
      ],
      providers: [
        FormBuilder,
        { provide: ClientService, useValue: clientService },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteEmployeeDialogComponent);
    component = fixture.componentInstance;
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
  it('should show success message and close dialog on successful invite', () => {
    const mockResponse = { message: 'Success' }; // Adjust response as needed
    component.inviteForm.controls['email'].setValue('test@example.com');

    clientService.inviteUser.and.returnValue(of(mockResponse));

    component.inviteUser();

    expect(clientService.inviteUser).toHaveBeenCalledWith('test@example.com');
    expect(snackbarService.showSuccess).toHaveBeenCalledWith(
      $localize`:@@employeeRegisterSuccess:Empleado invitado exitosamente.`,
    );
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show error message if user already exists', () => {
    component.inviteForm.controls['email'].setValue('duplicate@example.com');
    clientService.inviteUser.and.returnValue(throwError(() => new DuplicateEmployeeExistError()));

    component.inviteUser();

    expect(clientService.inviteUser).toHaveBeenCalledWith('duplicate@example.com');
    expect(snackbarService.showError).toHaveBeenCalledWith(
      $localize`:@@DuplicateEmployeeExistError:Empleado ya vinculado a tu empresa.`,
    );
  });
  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
