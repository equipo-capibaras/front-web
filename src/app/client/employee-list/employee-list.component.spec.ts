import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeListComponent } from './employee-list.component';
import { ClientService } from '../client.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { of, throwError } from 'rxjs';
import { EmployeeListResponse } from './employee-list';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingService } from 'src/app/services/loading.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let httpMock: HttpTestingController;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

  const mockEmployeesResponse: EmployeeListResponse = {
    employees: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        invitationStatus: 'accepted',
        clientId: '123',
        invitationDate: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'analyst',
        invitationStatus: 'pending',
        clientId: '124',
        invitationDate: new Date().toISOString(),
      },
    ],
    totalEmployees: 10,
    currentPage: 1,
    totalPages: 5,
  };

  beforeEach(waitForAsync(() => {
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['loadClientEmployees']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['showError']);

    TestBed.configureTestingModule({
      imports: [
        EmployeeListComponent,
        MatPaginatorModule,
        MatTableModule,
        MatChipsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', fakeAsync(() => {
    clientServiceSpy.loadClientEmployees.and.returnValue(of(mockEmployeesResponse));
    component.ngOnInit();
    fixture.detectChanges();

    expect(clientServiceSpy.loadClientEmployees).toHaveBeenCalledWith(5, 1);
    expect(component.employeesList.data.length).toBe(2);
    expect(component.totalEmployees).toBe(10);
  }));

  it('should paginate correctly', fakeAsync(() => {
    clientServiceSpy.loadClientEmployees.and.returnValue(of(mockEmployeesResponse));

    component.ngOnInit();
    fixture.detectChanges();

    component.paginator.page.emit({ pageIndex: 1, pageSize: 5, length: 10 });
    fixture.detectChanges();
    tick();

    expect(clientServiceSpy.loadClientEmployees).toHaveBeenCalledWith(5, 2);
  }));

  it('should show error when loadClientEmployees fails', () => {
    const error = new Error('Loading employees details');
    clientServiceSpy.loadClientEmployees.and.returnValue(throwError(() => error));

    fixture.detectChanges();
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
    expect(snackbarServiceSpy.showError).toHaveBeenCalled();
  });
});
