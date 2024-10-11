import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class NavbarMock {}

describe('AppComponent', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['userRole$']);
    Object.defineProperty(authService, 'userRole$', {
      get: () => of(null),
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    })
      .overrideComponent(AppComponent, {
        remove: { imports: [NavbarComponent] },
        add: { imports: [NavbarMock] },
      })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
