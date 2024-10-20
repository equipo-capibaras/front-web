import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SelectPlanComponent } from './select-plan.component';
import { AuthService } from '../../auth/auth.service';
import { ClientService } from '../client.service';
import { Role } from '../../auth/role';

@Component({
  selector: 'app-mock',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class ComponentMock {}

describe('SelectPlanComponent', () => {
  let component: SelectPlanComponent;
  let fixture: ComponentFixture<SelectPlanComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['getRole']);
    clientService = jasmine.createSpyObj('ClientService', ['savePlan']);

    await TestBed.configureTestingModule({
      imports: [SelectPlanComponent, NoopAnimationsModule],
      providers: [
        provideRouter([
          { path: 'dashboards', component: ComponentMock },
          { path: 'incidents', component: ComponentMock },
          { path: 'admin', component: ComponentMock },
        ]),
        { provide: AuthService, useValue: authService },
        { provide: ClientService, useValue: clientService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save plan', waitForAsync(() => {
    const planName = 'planName';

    clientService.savePlan.and.returnValue(of(true));
    authService.getRole.and.returnValue(Role.Admin);

    component.savePlan(planName);

    expect(clientService.savePlan).toHaveBeenCalledWith(planName);
  }));
});
