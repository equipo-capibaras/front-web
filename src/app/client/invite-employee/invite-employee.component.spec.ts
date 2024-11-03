import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { InviteEmployeeComponent } from './invite-employee.component';
import {
  ClientResponse,
  ClientService,
  DuplicateEmployeeExistError,
  Employee,
  EmployeeNotFoundError,
} from '../client.service';
import { InviteEmployeeDialogComponent } from '../invite-employee-dialog/invite-employee-dialog.component';
import { InviteConfirmDialogComponent } from '../invite-confirm-dialog/invite-confirm-dialog.component';
import { SnackbarService } from '../../services/snackbar.service';

describe('InviteEmployeeComponent', () => {
  let component: InviteEmployeeComponent;
  let fixture: ComponentFixture<InviteEmployeeComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let clientService: jasmine.SpyObj<ClientService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;

  beforeEach(waitForAsync(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    clientService = jasmine.createSpyObj('ClientService', ['getEmployeeByEmail', 'inviteUser']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showError', 'showSuccess']);

    TestBed.configureTestingModule({
      imports: [InviteEmployeeComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ClientService, useValue: clientService },
        { provide: SnackbarService, useValue: snackbarService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function randomEmployee(): Employee {
    return {
      id: faker.string.uuid(),
      clientId: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'analyst',
      invitationStatus: 'pending',
      invitationDate: '2024-01-01T00:00:00Z',
    };
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle invite dialog cancel', () => {
    dialogSpy.open.and.callFake((component, _config) => {
      if (component === InviteEmployeeDialogComponent) {
        return {
          afterClosed: () => of(undefined),
        } as MatDialogRef<undefined>;
      }

      throw new Error('Unexpected dialog component');
    });

    component.openInviteDialog();

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should handle employee does not exist', () => {
    dialogSpy.open.and.callFake((component, _config) => {
      if (component === InviteEmployeeDialogComponent) {
        return {
          afterClosed: () => of(faker.internet.email()),
        } as MatDialogRef<undefined>;
      }

      throw new Error('Unexpected dialog component');
    });

    clientService.getEmployeeByEmail.and.returnValue(throwError(() => new EmployeeNotFoundError()));

    component.openInviteDialog();

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should handle cancel of confirm dialog', () => {
    const mockEmployee = randomEmployee();

    dialogSpy.open.and.callFake((component, _config) => {
      if (component === InviteEmployeeDialogComponent) {
        return {
          afterClosed: () => of(mockEmployee.email),
        } as MatDialogRef<undefined>;
      } else if (component === InviteConfirmDialogComponent) {
        return {
          afterClosed: () => of(false),
        } as MatDialogRef<undefined>;
      }

      throw new Error('Unexpected dialog component');
    });

    clientService.getEmployeeByEmail.and.returnValue(of(mockEmployee));

    component.openInviteDialog();

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should invite user', () => {
    const mockEmployee = randomEmployee();

    dialogSpy.open.and.callFake((component, _config) => {
      if (component === InviteEmployeeDialogComponent) {
        return {
          afterClosed: () => of(mockEmployee.email),
        } as MatDialogRef<undefined>;
      } else if (component === InviteConfirmDialogComponent) {
        return {
          afterClosed: () => of(true),
        } as MatDialogRef<undefined>;
      }

      throw new Error('Unexpected dialog component');
    });

    clientService.getEmployeeByEmail.and.returnValue(of(mockEmployee));
    clientService.inviteUser.and.returnValue(of({} as ClientResponse));

    component.openInviteDialog();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(snackbarService.showSuccess).toHaveBeenCalled();
  });

  [new DuplicateEmployeeExistError(), new EmployeeNotFoundError()].forEach(error => {
    it('should handle errors of invite', () => {
      const mockEmployee = randomEmployee();

      dialogSpy.open.and.callFake((component, _config) => {
        if (component === InviteEmployeeDialogComponent) {
          return {
            afterClosed: () => of(mockEmployee.email),
          } as MatDialogRef<undefined>;
        } else if (component === InviteConfirmDialogComponent) {
          return {
            afterClosed: () => of(true),
          } as MatDialogRef<undefined>;
        }

        throw new Error('Unexpected dialog component');
      });

      clientService.getEmployeeByEmail.and.returnValue(of(mockEmployee));
      clientService.inviteUser.and.returnValue(throwError(() => error));

      component.openInviteDialog();

      expect(dialogSpy.open).toHaveBeenCalled();
      expect(snackbarService.showError).toHaveBeenCalled();
    });
  });
});
