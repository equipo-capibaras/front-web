import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { faker } from '@faker-js/faker';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Role } from './role';
import { defaultRoutes } from './default.routes';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getRole']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to / and return false if user is not authenticated', () => {
    const role = faker.helpers.arrayElement(Object.values(Role));

    authService.getRole.and.returnValue(null);

    const routeSnapshot = new ActivatedRouteSnapshot();
    routeSnapshot.data = { roles: [role] };

    const result = executeGuard(routeSnapshot, {} as RouterStateSnapshot);

    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(result).toBe(false);
  });

  it('should redirect to / and return false if role is unknown', () => {
    const role = faker.helpers.arrayElement(Object.values(Role));

    authService.getRole.and.returnValue(null);

    const routeSnapshot = new ActivatedRouteSnapshot();
    routeSnapshot.data = { roles: [role] };

    const result = executeGuard(routeSnapshot, {} as RouterStateSnapshot);

    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(result).toBe(false);
  });

  it('should redirect to default route of role and return false if role is not allowed to access', () => {
    const roles = faker.helpers.arrayElements(Object.values(Role), 2);
    authService.getRole.and.returnValue(roles[0]);

    const routeSnapshot = new ActivatedRouteSnapshot();
    routeSnapshot.data = { roles: [roles[1]] };

    const result = executeGuard(routeSnapshot, {} as RouterStateSnapshot);

    expect(router.navigate).toHaveBeenCalledWith([defaultRoutes[roles[0]]]);
    expect(result).toBe(false);
  });

  it('should return true if role is allowed to access', () => {
    const role = faker.helpers.arrayElement(Object.values(Role));

    authService.getRole.and.returnValue(role);

    const routeSnapshot = new ActivatedRouteSnapshot();
    routeSnapshot.data = { roles: [role] };

    const result = executeGuard(routeSnapshot, {} as RouterStateSnapshot);

    expect(router.navigate).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
