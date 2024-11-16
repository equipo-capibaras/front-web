import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AIAsistenceDialogComponent } from './ai-asistence-dialog.component';

describe('AIAsistenceDialogComponent', () => {
  let component: AIAsistenceDialogComponent;
  let fixture: ComponentFixture<AIAsistenceDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AIAsistenceDialogComponent>>;

  const testData = { message: 'Test data' };

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [AIAsistenceDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: testData },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AIAsistenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject data correctly', () => {
    expect(component.data).toEqual(testData);
  });

  it('should close the dialog with false on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
