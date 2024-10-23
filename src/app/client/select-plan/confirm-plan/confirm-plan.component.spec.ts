import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmPlanComponent } from './confirm-plan.component';

describe('ConfirmPlanComponent', () => {
  let component: ConfirmPlanComponent;
  let fixture: ComponentFixture<ConfirmPlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPlanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
