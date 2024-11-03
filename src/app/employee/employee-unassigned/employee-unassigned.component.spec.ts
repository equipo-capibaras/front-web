import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { EmployeeUnassignedComponent } from './employee-unassigned.component';
import { SnackbarService } from '../../services/snackbar.service';
import {
  ClientService,
  InvitationAlreadyAcceptedError,
  InvitationNotFoundError,
} from '../../client/client.service';
import { AuthService } from '../../auth/auth.service';
import { EmployeeResponse, EmployeeService } from '../employee.service';
import { Role } from '../../auth/role';

describe('EmployeeUnassignedComponent', () => {
  let component: EmployeeUnassignedComponent;
  let fixture: ComponentFixture<EmployeeUnassignedComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let authService: jasmine.SpyObj<AuthService>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['refreshToken']);
    clientService = jasmine.createSpyObj('ClientService', ['respondInvitation']);
    employeeService = jasmine.createSpyObj('EmployeeService', ['loadEmployeeData']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess', 'showError']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [EmployeeUnassignedComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ClientService, useValue: clientService },
        { provide: EmployeeService, useValue: employeeService },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();
  });

  function setupComponent(invitationStatus: string) {
    const mockResponse: EmployeeResponse = {
      id: faker.string.uuid(),
      clientId: null,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(Object.values(Role)),
      invitationStatus: invitationStatus,
      invitationDate: faker.date.past(),
    };

    employeeService.loadEmployeeData.and.returnValue(of(mockResponse));

    fixture = TestBed.createComponent(EmployeeUnassignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setupComponent('uninvited');

    expect(component).toBeTruthy();
  });

  it('should accept invitation', () => {
    dialog.open.and.returnValue({
      afterClosed: () => of('accepted'),
    } as MatDialogRef<undefined>);

    clientService.respondInvitation.and.returnValue(of(undefined));

    setupComponent('pending');

    expect(snackbarService.showSuccess).toHaveBeenCalled();
  });

  it('should decline invitation', () => {
    dialog.open.and.returnValue({
      afterClosed: () => of('declined'),
    } as MatDialogRef<undefined>);

    clientService.respondInvitation.and.returnValue(of(undefined));

    setupComponent('pending');

    expect(snackbarService.showSuccess).toHaveBeenCalled();
  });

  it('should handle InvitationAlreadyAcceptedError', () => {
    dialog.open.and.returnValue({
      afterClosed: () => of('accepted'),
    } as MatDialogRef<undefined>);

    clientService.respondInvitation.and.returnValue(
      throwError(() => new InvitationAlreadyAcceptedError()),
    );

    setupComponent('pending');

    expect(snackbarService.showError).toHaveBeenCalled();
  });

  it('should handle InvitationNotFoundError', () => {
    dialog.open.and.returnValue({
      afterClosed: () => of('accepted'),
    } as MatDialogRef<undefined>);

    clientService.respondInvitation.and.returnValue(
      throwError(() => new InvitationNotFoundError()),
    );

    setupComponent('pending');

    expect(snackbarService.showError).toHaveBeenCalled();
  });
});
