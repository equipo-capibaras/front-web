import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-mock',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class ComponentMock {}

describe('NavbarComponent', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['userRole$', 'logout']);
    Object.defineProperty(authService, 'userRole$', {
      get: () => of(null),
    });

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([
          { path: 'navbar', component: ComponentMock, data: { showNavbar: true } },
          { path: 'noNavbar', component: ComponentMock, data: { showNavbar: false } },
        ]),
        { provide: AuthService, useValue: authService },
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
});
