import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { NavbarComponent } from './navbar.component';
import { AuthService, Invitation } from '../auth/auth.service';

@Component({
  selector: 'app-mock',
  standalone: true,
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
class ComponentMock {}

describe('NavbarComponent', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let dialog: jasmine.SpyObj<MatDialog>;
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', [
      'userRole$',
      'logout',
      'getToken',
      'checkPendingInvitation',
      'acceptInvitation',
      'declineInvitation',
    ]);

    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    // Mock the userRole$ observable
    Object.defineProperty(authService, 'userRole$', {
      get: () => of(null),
    });

    // Mock getToken to return a fake token
    authService.getToken.and.returnValue('mock-token');

    // Mock checkPendingInvitation to return a complete simulated response
    authService.checkPendingInvitation.and.returnValue(
      of({
        id: 'mock-id',
        clientId: 'mock-client-id',
        name: 'mock-name',
        email: 'mock-email',
        invitationStatus: 'pending',
        role: 'mock-role', // Add this property
        invitationDate: new Date(), // Add this property (mock date)
      } as Invitation), // Type assertion to ensure it matches the Invitation type
    );

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([
          { path: 'navbar', component: ComponentMock, data: { showNavbar: true } },
          { path: 'noNavbar', component: ComponentMock, data: { showNavbar: false } },
        ]),
        { provide: AuthService, useValue: authService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout when logout() is called', () => {
    spyOn(router, 'navigate');

    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show navbar based on route data', waitForAsync(() => {
    router.navigate(['navbar']).then(() => {
      fixture.detectChanges();
      expect(component.showNavbar).toBeTrue();

      router.navigate(['noNavbar']).then(() => {
        fixture.detectChanges();
        expect(component.showNavbar).toBeFalse();
      });
    });
  }));

  it('should open the invitation dialog if there is a pending invitation', () => {
    // Simulate a pending invitation
    const invitationResponse: Invitation = {
      id: 'mock-id',
      clientId: 'mock-client-id',
      name: 'mock-name',
      email: 'mock-email',
      invitationStatus: 'pending',
      role: 'mock-role',
      invitationDate: new Date(),
    };

    authService.checkPendingInvitation.and.returnValue(of(invitationResponse));

    dialog.open.and.returnValue({
      afterClosed: () => of('accepted'),
      close: () => {
        /* no-op */
      },
      backdropClick: () => of(),
      keydownEvents: () => of(),
      updateSize: () => dialog.open,
      updatePosition: () => dialog.open,
      addPanelClass: () => dialog.open,
      removePanelClass: () => dialog.open,
    } as unknown as MatDialogRef<unknown, unknown>);

    component.checkPendingInvitation();

    expect(authService.checkPendingInvitation).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should accept the invitation when accepted', () => {
    const invitationResponse: Invitation = {
      id: 'mock-id',
      clientId: 'mock-client-id',
      name: 'mock-name',
      email: 'mock-email',
      invitationStatus: 'pending',
      role: 'mock-role',
      invitationDate: new Date(),
    };

    authService.checkPendingInvitation.and.returnValue(of(invitationResponse));
    dialog.open.and.returnValue({
      afterClosed: () => of('accepted'),
      close: () => {
        // Add meaningful implementation or remove if not needed
      },
      backdropClick: () => of(),
      keydownEvents: () => of(),
      updateSize: () => dialog.open,
      updatePosition: () => dialog.open,
      addPanelClass: () => dialog.open,
      removePanelClass: () => dialog.open,
    } as unknown as MatDialogRef<unknown, unknown>);

    component.checkPendingInvitation();

    expect(authService.acceptInvitation).toHaveBeenCalled();
  });

  it('should decline the invitation when declined', () => {
    const invitationResponse: Invitation = {
      id: 'mock-id',
      clientId: 'mock-client-id',
      name: 'mock-name',
      email: 'mock-email',
      invitationStatus: 'pending',
      role: 'mock-role',
      invitationDate: new Date(),
    };

    authService.checkPendingInvitation.and.returnValue(of(invitationResponse));
    dialog.open.and.returnValue({
      afterClosed: () => of('declined'),
      close: () => {
        // Add meaningful implementation or remove if not needed
      },
      backdropClick: () => of(),
      keydownEvents: () => of(),
      updateSize: () => dialog.open,
      updatePosition: () => dialog.open,
      addPanelClass: () => dialog.open,
      removePanelClass: () => dialog.open,
    } as unknown as MatDialogRef<unknown, unknown>);

    component.checkPendingInvitation();

    expect(authService.declineInvitation).toHaveBeenCalled();
  });
});
