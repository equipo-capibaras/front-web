import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmployeeUnassignedComponent } from './employee-unassigned.component';
import { ClientService } from './../../client/client.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { InvitationDialogComponent } from '../invite-message/invite-message.component';
import { Router } from '@angular/router';
import { defaultRoutes } from 'src/app/auth/default.routes';

describe('EmployeeUnassignedComponent', () => {
  let component: EmployeeUnassignedComponent;
  let fixture: ComponentFixture<EmployeeUnassignedComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

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

    TestBed.configureTestingModule({
      imports: [MatDialogModule, EmployeeUnassignedComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }, // Add Router spy
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeUnassignedComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call isUnassigned on ngOnInit', () => {
    authServiceSpy.isUnassigned.and.returnValue(false);
    component.ngOnInit();
    expect(authServiceSpy.isUnassigned).toHaveBeenCalled();
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

    spyOn(component, 'acceptInvitation'); // Spy on acceptInvitation
    component.openPopup();
    tick(); // Simulate passage of time
    expect(component.acceptInvitation).toHaveBeenCalled();
  }));

  it('should call declineInvitation when declined', fakeAsync(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of('declined'));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    spyOn(component, 'declineInvitation'); // Spy on declineInvitation
    component.openPopup();
    tick(); // Simulate passage of time
    expect(component.declineInvitation).toHaveBeenCalled();
  }));

  it('should accept invitation successfully', fakeAsync(() => {
    const token = 'sampleToken';
    authServiceSpy.getToken.and.returnValue(token);
    authServiceSpy.refreshToken.and.returnValue(of(true));
    clientServiceSpy.acceptInvitation.and.returnValue(of(undefined));
    const role: keyof typeof defaultRoutes = 'admin' as keyof typeof defaultRoutes; // or any valid role
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

  it('should handle error in acceptInvitation when refreshing token', fakeAsync(() => {
    const token = 'sampleToken';
    authServiceSpy.getToken.and.returnValue(token);
    clientServiceSpy.acceptInvitation.and.returnValue(of(undefined));
    authServiceSpy.refreshToken.and.returnValue(throwError({ message: 'Token refresh error' }));

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
});
