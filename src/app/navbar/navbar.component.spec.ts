import { AppComponent } from './../app.component';
import { AuthService } from './../auth/auth.service';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: '',
})
class MockNavbarComponent {}

describe('AppComponent', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getRole']);
    authService.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      declarations: [AppComponent, MockNavbarComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();
  });

  it('should create the app navbar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
