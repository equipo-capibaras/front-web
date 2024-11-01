import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmployeeUnassignedComponent } from './employee-unassigned.component';
import { ClientService } from './../../client/client.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { InvitationDialogComponent } from '../invite-message/invite-message.component';
import { Router } from '@angular/router';
import { defaultRoutes } from 'src/app/auth/default.routes';
import { EmployeeResponse, EmployeeService } from '../employee.service';

describe('EmployeeUnassignedComponent', () => {
  let component: EmployeeUnassignedComponent;
  let fixture: ComponentFixture<EmployeeUnassignedComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isUnassigned',
      'getToken',
      'acceptInvitation',
      'refreshToken',
      'getRole',
    ]);

    clientServiceSpy = jasmine.createSpyObj('ClientService', [
      'acceptInvitation',
      'declineInvitation',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'validateStatusInvitation',
    ]);

    TestBed.configureTestingModule({
      imports: [MatDialogModule, EmployeeUnassignedComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }, // Add Router spy
        { provide: EmployeeService, useValue: employeeServiceSpy },
      ],
    }).compileComponents();

    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;

    fixture = TestBed.createComponent(EmployeeUnassignedComponent);
    component = fixture.componentInstance;
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

  it('should call acceptInvitation when accepted', fakeAsync(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of('accepted'));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    spyOn(component, 'acceptInvitation');
    component.openPopup();
    tick();
    expect(component.acceptInvitation).toHaveBeenCalled();
  }));

  it('should call declineInvitation when declined', fakeAsync(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of('declined'));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    spyOn(component, 'declineInvitation');
    component.openPopup();
    tick(); // Simulate passage of time
    expect(component.declineInvitation).toHaveBeenCalled();
  }));

  it('should accept invitation successfully', fakeAsync(() => {
    const token = 'sampleToken';
    authServiceSpy.getToken.and.returnValue(token);
    authServiceSpy.refreshToken.and.returnValue(of(true));
    clientServiceSpy.acceptInvitation.and.returnValue(of(undefined));
    const role: keyof typeof defaultRoutes = 'admin' as keyof typeof defaultRoutes;
    authServiceSpy.getRole.and.returnValue(role);

    component.acceptInvitation();
    tick();
    expect(clientServiceSpy.acceptInvitation).toHaveBeenCalledWith(token);
    expect(authServiceSpy.refreshToken).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([defaultRoutes[role]]);
  }));

  it('should handle 409 error when accepting invitation', fakeAsync(() => {
    const token = 'sampleToken';
    authServiceSpy.getToken.and.returnValue(token);
    clientServiceSpy.acceptInvitation.and.returnValue(
      throwError({ status: 409, message: 'Conflict' }),
    );

    component.acceptInvitation();
    tick();
    expect(clientServiceSpy.acceptInvitation).toHaveBeenCalledWith(token);
  }));

  it('should decline invitation successfully', fakeAsync(() => {
    const token = 'sampleToken';
    authServiceSpy.getToken.and.returnValue(token);
    clientServiceSpy.declineInvitation.and.returnValue(of(undefined));
    component.declineInvitation();
    tick();
    expect(clientServiceSpy.declineInvitation).toHaveBeenCalledWith(token);
    expect(component.invitation).toBeNull();
  }));

  it('should handle error in declineInvitation', fakeAsync(() => {
    const token = 'sampleToken';
    authServiceSpy.getToken.and.returnValue(token);
    const errorResponse = { status: 500, message: 'Server error' };
    clientServiceSpy.declineInvitation.and.returnValue(throwError(errorResponse));
    component.declineInvitation();
    tick();
    expect(clientServiceSpy.declineInvitation).toHaveBeenCalledWith(token);
  }));

  it('should return true if invitation status is pending', async () => {
    const mockResponse: EmployeeResponse = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      invitationStatus: 'pending',
      clientId: '123',
      invitationDate: new Date('2024-01-01T00:00:00Z'),
    };

    employeeService.validateStatusInvitation.and.returnValue(of(mockResponse));

    const result = await component.getStatusInvitation();
    expect(result).toBeTrue();
  });

  it('should return false if invitation status is not pending', async () => {
    const mockResponse: EmployeeResponse = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      invitationStatus: 'accepted',
      clientId: '123',
      invitationDate: new Date('2024-01-01T00:00:00Z'),
    };
    employeeService.validateStatusInvitation.and.returnValue(of(mockResponse));
    const result = await component.getStatusInvitation();
    expect(result).toBeFalse();
  });

  it('should return false if the response is null', async () => {
    employeeService.validateStatusInvitation.and.returnValue(of(null));

    const result = await component.getStatusInvitation();
    expect(result).toBeFalse();
  });

  it('should return false if validateStatusInvitation throws an error', async () => {
    employeeService.validateStatusInvitation.and.returnValue(
      throwError(() => new Error('Service error')),
    );
    const result = await component.getStatusInvitation();
    expect(result).toBeFalse();
  });
});
