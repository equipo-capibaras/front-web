import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { faker } from '@faker-js/faker';
import { ClientRegisterComponent } from './client-register.component';
import { ClientResponse, ClientService, DuplicateEmailError } from '../client.service';
import { AuthService } from '../../auth/auth.service';
import { of, throwError } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-mock',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class ComponentMock {}

describe('ClientRegisterComponent', () => {
  let component: ClientRegisterComponent;
  let fixture: ComponentFixture<ClientRegisterComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['refreshToken']);
    clientService = jasmine.createSpyObj('ClientService', ['register']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showError', 'showSuccess']);

    await TestBed.configureTestingModule({
      imports: [ClientRegisterComponent, NoopAnimationsModule],
      providers: [
        provideRouter([{ path: 'client/select-plan', component: ComponentMock }]),
        { provide: AuthService, useValue: authService },
        { provide: ClientService, useValue: clientService },
        { provide: SnackbarService, useValue: snackbarService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched on invalid submit', () => {
    component.register();
    expect(component.registerForm.touched).toBeTruthy();
  });

  it('should register a client', waitForAsync(() => {
    const name = faker.person.fullName();
    const email = faker.internet.domainWord();

    component.registerForm.setValue({
      name: name,
      email: email,
    });

    const mockResponse: ClientResponse = {
      id: faker.string.uuid(),
      name: name,
      emailIncidents: email + '@capibaras.io',
      plan: null,
    };

    authService.refreshToken.and.returnValue(of(true));
    clientService.register.and.returnValue(of(mockResponse));

    component.register();

    expect(clientService.register).toHaveBeenCalledWith({
      name: name,
      prefixEmailIncidents: email,
    });
  }));

  it('should show error snackbar on duplicate email error', waitForAsync(() => {
    component.register();

    const name = faker.person.fullName();
    const email = faker.internet.domainWord();

    component.registerForm.setValue({
      name: name,
      email: email,
    });

    clientService.register.and.returnValue(throwError(() => new DuplicateEmailError()));

    component.register();

    expect(snackbarService.showError).toHaveBeenCalled();
  }));
});
