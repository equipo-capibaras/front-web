import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUnassignedComponent } from './employee-unassigned.component';

describe('EmployeeUnassignedComponent', () => {
  let component: EmployeeUnassignedComponent;
  let fixture: ComponentFixture<EmployeeUnassignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeUnassignedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeUnassignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
