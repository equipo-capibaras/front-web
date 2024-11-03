import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faker } from '@faker-js/faker';
import { InviteEmployeeDialogComponent } from './invite-employee-dialog.component';

describe('InviteEmployeeDialogComponent', () => {
  let component: InviteEmployeeDialogComponent;
  let fixture: ComponentFixture<InviteEmployeeDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<InviteEmployeeDialogComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [InviteEmployeeDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched on invalid submit', () => {
    component.submit();
    expect(component.inviteForm.touched).toBeTruthy();
  });

  it('should submit', () => {
    const email = faker.internet.email();
    component.inviteForm.setValue({ email });

    component.submit();

    expect(dialogRef.close).toHaveBeenCalledWith(email);
  });

  it('should close', () => {
    component.close();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
