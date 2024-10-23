import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmPlanComponent } from './confirm-plan.component';

describe('ConfirmPlanComponent', () => {
  let component: ConfirmPlanComponent;
  let fixture: ComponentFixture<ConfirmPlanComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmPlanComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [MatButtonModule, ConfirmPlanComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { currentPlan: 'Emprendedor', newPlan: 'Empresario', newPrice: '$27,000' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with true when onConfirm is called', () => {
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when onCancel is called', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should show advance payment period message if within first 5 days of the month', () => {
    jasmine.clock().install();
    const mockDate = new Date(2024, 9, 2);
    jasmine.clock().mockDate(mockDate);

    fixture = TestBed.createComponent(ConfirmPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isWithinAdvancePaymentPeriod).toBeTrue();
    expect(component.billingMessage).toContain('Estás dentro de los 5 primeros días del mes.');

    jasmine.clock().uninstall();
  });

  it('should show regular billing message if after first 5 days of the month', () => {
    jasmine.clock().install();
    const mockDate = new Date(2024, 9, 10);
    jasmine.clock().mockDate(mockDate);

    fixture = TestBed.createComponent(ConfirmPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isWithinAdvancePaymentPeriod).toBeFalse();
    expect(component.billingMessage).toContain(
      'El cambio de plan se aplicará a partir del próximo mes.',
    );

    jasmine.clock().uninstall();
  });
});
