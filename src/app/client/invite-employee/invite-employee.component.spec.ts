import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { InviteEmployeeDialogComponent } from '../invite-employee-dialog/invite-employee-dialog.component';
import { By } from '@angular/platform-browser';
import { InviteEmployeeComponent } from './invite-employee.component';

describe('InviteEmployeeComponent', () => {
  let component: InviteEmployeeComponent;
  let fixture: ComponentFixture<InviteEmployeeComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(waitForAsync(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [InviteEmployeeComponent, NoopAnimationsModule, MatButtonModule],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the invite dialog when openInviteDialog is called', () => {
    component.openInviteDialog();
    expect(dialogSpy.open).toHaveBeenCalledWith(InviteEmployeeDialogComponent, {
      width: '461px',
    });
  });

  it('should open the dialog when the button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    expect(dialogSpy.open).toHaveBeenCalledWith(InviteEmployeeDialogComponent, {
      width: '461px',
    });
  });
});
