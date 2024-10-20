import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ClientInfoComponent } from './client-info.component';
import { ClientService } from '../client.service';
import { of } from 'rxjs';
import { Client } from '../client';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ClientInfoComponent', () => {
  let component: ClientInfoComponent;
  let fixture: ComponentFixture<ClientInfoComponent>;
  let httpMock: HttpTestingController;
  let clientService: ClientService;

  const mockClientData: Client = {
    id: '1',
    name: 'Empresa S.A.S',
    plan: 'empresario',
    emailIncidents: 'pqrs-empresa@capibaras.io',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClientInfoComponent, NoopAnimationsModule],
      providers: [ClientService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientInfoComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load client data on init', fakeAsync(() => {
    spyOn(clientService, 'loadClientData').and.returnValue(of(mockClientData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(clientService.loadClientData).toHaveBeenCalled();
    expect(component.clientData).toEqual(mockClientData);
  }));

  it('should return formatted plan correctly', () => {
    component.clientData = mockClientData;

    const formattedPlan = component.formattedPlan;
    expect(formattedPlan).toBe('Empresario');
  });

  it('should return "-" when plan is not available', () => {
    component.clientData = { ...mockClientData, plan: '' };

    const formattedPlan = component.formattedPlan;
    expect(formattedPlan).toBe('-');
  });

  it('should set clientData to null if service returns null', fakeAsync(() => {
    spyOn(clientService, 'loadClientData').and.returnValue(of(null));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.clientData).toBeNull();
  }));
});
