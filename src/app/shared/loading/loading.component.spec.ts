import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { LoadingService } from 'src/app/services/loading.service';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);

    const loadingServiceMock = {
      loading$: loadingSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [{ provide: LoadingService, useValue: loadingServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the loading spinner when loading$ is true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.directive(MatProgressSpinner));
    expect(spinner).toBeTruthy();
  });

  it('should hide the loading spinner when loading$ is false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.directive(MatProgressSpinner));
    expect(spinner).toBeFalsy();
  });
});
