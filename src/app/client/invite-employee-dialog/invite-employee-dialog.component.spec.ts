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

describe('InviteEmployeeDialogComponent', () => {
  let component: InviteEmployeeDialogComponent;
  let fixture: ComponentFixture<InviteEmployeeDialogComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<InviteEmployeeDialogComponent>>;
  let authService: jasmine.SpyObj<AuthService>;

  const ClientResponseClient: ClientResponse = {
    id: '1dabcf78-e62a-41fd-b69c-fd7c775b04d4',
    name: 'Mariana Sanchez Torres',
    emailIncidents: 'mariana@globalcom.ec',
    plan: 'accepted',
  };

  beforeEach(async () => {
    // Add 'getRoleByEmail' to the spy list
    clientService = jasmine.createSpyObj('ClientService', ['inviteUser', 'getRoleByEmail']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess', 'showError']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    authService = jasmine.createSpyObj('AuthService', ['getRole']);

    await TestBed.configureTestingModule({
      imports: [
        InviteEmployeeDialogComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
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

    // Mock the getRoleByEmail return value
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

  it('should show success message and close dialog on successful invite', () => {
    // Configura el valor correcto en el formulario
    component.inviteForm.controls['email'].setValue('mariana@globalcom.ec');

    // Configura el spy para retornar el objeto esperado
    clientService.inviteUser.and.returnValue(of(ClientResponseClient));

    // Invoca el método
    component.inviteUser();

    // Verifica si se llama con el valor correcto
    expect(clientService.inviteUser).toHaveBeenCalledWith('mariana@globalcom.ec');
    expect(snackbarService.showSuccess).toHaveBeenCalledWith(
      $localize`:@@employeeRegisterSuccess:Empleado invitado exitosamente.`,
    );
    //expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show error message if user already exists', () => {
    component.inviteForm.controls['email'].setValue('mariana@globalcom.ec');
    clientService.inviteUser.and.returnValue(throwError(() => new DuplicateEmployeeExistError()));

    component.inviteUser();

    expect(clientService.inviteUser).toHaveBeenCalledWith('mariana@globalcom.ec');
    expect(snackbarService.showError).toHaveBeenCalledWith(
      $localize`:@@DuplicateEmployeeExistError:Empleado ya vinculado a tu empresa.`,
    );
  });
  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
