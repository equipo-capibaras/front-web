import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SelectPlanService } from './select-plan.service';
import { SelectPlanComponent } from './select-plan.component'; // Import instead of declaring

describe('SelectPlanComponent', () => {
  let component: SelectPlanComponent;
  let fixture: ComponentFixture<SelectPlanComponent>;
  let selectPlanService: jasmine.SpyObj<SelectPlanService>;
  let router: Router;

  beforeEach(async () => {
    const selectPlanServiceSpy = jasmine.createSpyObj('SelectPlanService', ['savePlan']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        SelectPlanComponent,
      ],
      providers: [{ provide: SelectPlanService, useValue: selectPlanServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPlanComponent);
    component = fixture.componentInstance;
    selectPlanService = TestBed.inject(SelectPlanService) as jasmine.SpyObj<SelectPlanService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call savePlan on the service when savePlan method is called', () => {
    const mockPlanData = {
      name: 'Pro Plan',
      price: 100,
      date: new Date().toISOString(),
    };

    selectPlanService.savePlan.and.returnValue(of(true));

    component.savePlan(mockPlanData.name, mockPlanData.price);

    expect(selectPlanService.savePlan).toHaveBeenCalledWith(mockPlanData);
  });

  it('should navigate to home on successful plan saving', () => {
    const routerSpy = spyOn(router, 'navigate');
    selectPlanService.savePlan.and.returnValue(of(true));

    component.savePlan('Pro Plan', 100);

    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to home even on failed plan saving', () => {
    const routerSpy = spyOn(router, 'navigate');
    selectPlanService.savePlan.and.returnValue(of(false));

    component.savePlan('Pro Plan', 100);

    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });
});
