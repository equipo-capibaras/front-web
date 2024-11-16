import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AIAssistenceDialogComponent } from './ai-assistence-dialog.component';

describe('AIAssistenceDialogComponent', () => {
  let component: AIAssistenceDialogComponent;
  let fixture: ComponentFixture<AIAssistenceDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AIAssistenceDialogComponent>>;

  const testData = { message: 'Test data' };

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [AIAssistenceDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: testData },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AIAssistenceDialogComponent);
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
