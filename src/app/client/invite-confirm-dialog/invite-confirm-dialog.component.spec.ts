import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InviteConfirmDialogComponent } from './invite-confirm-dialog.component';

describe('InviteConfirmDialogComponent', () => {
  let component: InviteConfirmDialogComponent;
  let fixture: ComponentFixture<InviteConfirmDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<InviteConfirmDialogComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [InviteConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm invitation', () => {
    component.onConfirm();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should cancel invitation', () => {
    component.onCancel();

    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
