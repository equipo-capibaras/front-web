/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClientInfoComponent } from './client-info.component';
import { ClientService } from '../client.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, BehaviorSubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Client } from '../client';
import { provideHttpClient } from '@angular/common/http';

describe('ClientInfoComponent', () => {
  let component: ClientInfoComponent;
  let fixture: ComponentFixture<ClientInfoComponent>;
  let clientService: ClientService;
  let httpMock: HttpTestingController;

  const mockClientData: Client = {
    id: '1',
    name: 'Empresa S.A.S',
    plan: 'empresario',
    emailIncidents: 'pqrs-empresa@capibaras.io',
  };

  const clientDataSubject = new BehaviorSubject<Client | null>(mockClientData);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClientInfoComponent, NoopAnimationsModule],
      providers: [provideHttpClientTesting(), provideHttpClient()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInfoComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
    clientService['clientDataSubject'].next(mockClientData);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadClientData on init', () => {
    const loadClientDataSpy = spyOn(clientService, 'loadClientData').and.callThrough();
    component.ngOnInit();
    expect(loadClientDataSpy).toHaveBeenCalled();
  });

  it('should update clientData when service emits new data', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.clientData).toEqual(mockClientData);
  });

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
});
