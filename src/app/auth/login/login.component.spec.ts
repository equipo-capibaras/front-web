import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { faker } from '@faker-js/faker';

import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Role } from '../role';
import { defaultRoutes } from '../default.routes';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getRole', 'login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  function setupUnauthenticated() {
    authService.isAuthenticated.and.returnValue(false);
    authService.getRole.and.returnValue(null);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should not redirect if not authenticated', () => {
    spyOn(router, 'navigate');
    setupUnauthenticated();

    expect(component).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to default route of role if already authenticated', () => {
    spyOn(router, 'navigate');
    const role = faker.helpers.arrayElement(Object.values(Role));

    authService.isAuthenticated.and.returnValue(true);
    authService.getRole.and.returnValue(role);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([defaultRoutes[role]]);
  });

  it('should mark form as touched if invalid on login', () => {
    setupUnauthenticated();

    component.loginForm.setErrors({ invalid: true });
    component.login();
    expect(component.loginForm.touched).toBeTrue();
  });

  it('should not navigate on unsuccessful login', () => {
    spyOn(router, 'navigate');
    setupUnauthenticated();

    authService.login.and.returnValue(of(false));
    component.loginForm.setValue({
      username: faker.internet.email(),
      password: faker.internet.password(),
    });
    component.login();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to default route on successful login', () => {
    spyOn(router, 'navigate');
    const role = faker.helpers.arrayElement(Object.values(Role));
    setupUnauthenticated();

    authService.login.and.returnValue(of(true));
    authService.getRole.and.returnValue(role);
    component.loginForm.setValue({
      username: faker.internet.email(),
      password: faker.internet.password(),
    });
    component.login();
    expect(router.navigate).toHaveBeenCalledWith([defaultRoutes[role]]);
  });
});
