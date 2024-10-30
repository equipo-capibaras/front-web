import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmployeeUnassignedComponent } from './employee-unassigned.component';
import { ClientService } from './../../client/client.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { InvitationDialogComponent } from '../invite-message/invite-message.component';

describe('EmployeeUnassignedComponent', () => {
  let component: EmployeeUnassignedComponent;
  let fixture: ComponentFixture<EmployeeUnassignedComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

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

    TestBed.configureTestingModule({
      imports: [MatDialogModule, EmployeeUnassignedComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
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
