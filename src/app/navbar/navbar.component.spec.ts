import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';
import { provideRouter, Router } from '@angular/router';

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
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
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
});
