import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { faker } from '@faker-js/faker';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClientRegisterComponent } from './client-register.component';
import { ClientResponse, ClientService, DuplicateEmailError } from '../client.service';
import { of, throwError } from 'rxjs';

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
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    clientService = jasmine.createSpyObj('ClientService', ['register']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ClientRegisterComponent, NoopAnimationsModule],
      providers: [
        provideRouter([{ path: 'client/select-plan', component: ComponentMock }]),
        { provide: ClientService, useValue: clientService },
        { provide: MatSnackBar, useValue: snackBar },
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

    expect(snackBar.open).toHaveBeenCalled();
  }));
});
