import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SelectPlanComponent } from './select-plan.component';
import { AuthService } from '../../auth/auth.service';
import { ClientService } from '../client.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Observable, of, throwError } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Role } from 'src/app/auth/role';
import { provideRouter, Router } from '@angular/router';
import { ClientManagementComponent } from '../client-management/client-management.component';
import { Client } from '../client';

describe('SelectPlanComponent', () => {
  let component: SelectPlanComponent;
  let fixture: ComponentFixture<SelectPlanComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let loader: HarnessLoader;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    clientService = jasmine.createSpyObj('ClientService', ['savePlan', 'loadClientData']);
    authService = jasmine.createSpyObj('AuthService', ['getRole']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showError']);

    const mockClientData: Client = {
      id: '1',
      name: 'Empresa S.A.S',
      plan: 'empresario',
      emailIncidents: 'pqrs-empresa@capibaras.io',
    };

    clientService.loadClientData.and.returnValue(of(mockClientData));

    router = jasmine.createSpyObj('Router', ['navigate', 'url'], {
      url: '/admin/change-plan',
    });

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SelectPlanComponent],
      providers: [
        provideRouter([
          { path: 'admin', component: ClientManagementComponent },
          { path: 'client/select-plan', component: SelectPlanComponent },
          { path: 'admin/select-plan', component: SelectPlanComponent },
        ]),
        { provide: ClientService, useValue: clientService },
        { provide: AuthService, useValue: authService },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPlanComponent);
    component = fixture.componentInstance;
    component.currentUrl = '/admin/change-plan';
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog when selecting a plan from /admin/change-plan', async () => {
    const planId = 'empresario';
    const planName = 'Empresario';
    const price = '$27,000';
    component.handlePlanSelection(planId, planName, price);

    const dialogs = await loader.getAllHarnesses(MatDialogHarness);
    expect(dialogs.length).toBe(1);
  });

  it('should call close after confirming dialog', async () => {
    component.handlePlanSelection('empresario', 'Empresario', '$27,000');
    fixture.detectChanges();

    const dialogs = await loader.getAllHarnesses(MatDialogHarness);
    await dialogs[0].close();

    expect(dialogs.length).toBe(1);
  });

  it('should open saveData when selecting a plan from /client/select-plan', async () => {
    component.currentUrl = '/client/select-plan';
    clientService.savePlan.and.returnValue(of(true));
    authService.getRole.and.returnValue(Role.Admin);

    const planId = 'empresario';
    const planName = 'Empresario';
    const price = '$27,000';
    component.handlePlanSelection(planId, planName, price);

    expect(clientService.savePlan).toHaveBeenCalledWith(planId);
  });

  it('should show error if loading client data fails', async () => {
    const errorResponse = new Error('Error loading data');
    clientService.loadClientData.and.returnValue(throwError(() => errorResponse));

    fixture = TestBed.createComponent(SelectPlanComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(snackbarService.showError).toHaveBeenCalledWith(errorResponse.message);
  });
});
