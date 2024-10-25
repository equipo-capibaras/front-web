import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ClientInfoComponent } from './client-info.component';
import { ClientService } from '../client.service';
import { SnackbarService } from '../../services/snackbar.service';
import { of, throwError } from 'rxjs';
import { Client } from '../client';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('ClientInfoComponent', () => {
  let component: ClientInfoComponent;
  let fixture: ComponentFixture<ClientInfoComponent>;
  let httpMock: HttpTestingController;
  let clientService: ClientService;
  let snackbarService: SnackbarService;

  const mockClientData: Client = {
    id: '1',
    name: 'Empresa S.A.S',
    plan: 'empresario',
    emailIncidents: 'pqrs-empresa@capibaras.io',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClientInfoComponent, NoopAnimationsModule],
      providers: [
        ClientService,
        SnackbarService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientInfoComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService);
    snackbarService = TestBed.inject(SnackbarService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load client data on init with forceUpdate = true', fakeAsync(() => {
    spyOn(clientService, 'loadClientData').and.returnValue(of(mockClientData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(clientService.loadClientData).toHaveBeenCalledWith(true);
    expect(component.clientData).toEqual(mockClientData);
  }));

  it('should set clientData to null if service returns null', fakeAsync(() => {
    spyOn(clientService, 'loadClientData').and.returnValue(of(null));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.clientData).toBeNull();
  }));

  it('should show error message when loadClientData fails', fakeAsync(() => {
    const mockError = 'Error message';
    spyOn(clientService, 'loadClientData').and.returnValue(throwError(() => mockError));
    spyOn(snackbarService, 'showError');

    component.ngOnInit();
    fixture.detectChanges();

    expect(snackbarService.showError).toHaveBeenCalledWith(mockError);
  }));
});
