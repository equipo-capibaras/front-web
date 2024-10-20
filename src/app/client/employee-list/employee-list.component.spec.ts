import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeListComponent } from './employee-list.component';
import { ClientService } from '../client.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { of } from 'rxjs';
import { EmployeeListResponse } from './employee-list';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let httpMock: HttpTestingController;
  let clientService: ClientService;

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
    TestBed.configureTestingModule({
      imports: [
        EmployeeListComponent,
        MatPaginatorModule,
        MatTableModule,
        MatChipsModule,
        NoopAnimationsModule,
      ],
      providers: [ClientService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', fakeAsync(() => {
    spyOn(clientService, 'loadClientEmployees').and.returnValue(of(mockEmployeesResponse));
    component.ngOnInit();
    fixture.detectChanges();

    expect(clientService.loadClientEmployees).toHaveBeenCalledWith(5, 1);
    expect(component.employeesList.data.length).toBe(2);
    expect(component.totalEmployees).toBe(10);
  }));

  it('should paginate correctly', fakeAsync(() => {
    spyOn(clientService, 'loadClientEmployees').and.returnValue(of(mockEmployeesResponse));

    component.ngOnInit();
    fixture.detectChanges();

    component.paginator.page.emit({ pageIndex: 1, pageSize: 5, length: 10 });
    fixture.detectChanges();
    tick();

    expect(clientService.loadClientEmployees).toHaveBeenCalledWith(5, 2);
  }));
});
