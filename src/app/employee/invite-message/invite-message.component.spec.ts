// invitation-dialog.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { InvitationDialogComponent } from './invite-message.component';

describe('InvitationDialogComponent', () => {
  let component: InvitationDialogComponent;
  let fixture: ComponentFixture<InvitationDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<InvitationDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [InvitationDialogComponent],
      imports: [MatButtonModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test Company', role: 'Admin' } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with "accepted" when accept button is clicked', () => {
    const acceptButton = fixture.debugElement.query(
      By.css('[data-testid="accept-button"]'),
    ).nativeElement;
    acceptButton.click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith('accepted');
  });

  it('should close the dialog with "declined" when decline button is clicked', () => {
    const declineButton = fixture.debugElement.query(
      By.css('[data-testid="decline-button"]'),
    ).nativeElement;
    declineButton.click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith('declined');
  });

  it('should render heading text', () => {
    const heading = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(heading.textContent).toContain(
      'Desea aceptar la invitacion para asociarse a una compañia?',
    );
  });

  it('should have the dialogRef injected', () => {
    expect(component['dialogRef']).toBe(dialogRefSpy);
  });

  it('should have Accept and Decline buttons', () => {
    const acceptButton = fixture.debugElement.query(By.css('[data-testid="accept-button"]'));
    const declineButton = fixture.debugElement.query(By.css('[data-testid="decline-button"]'));

    expect(acceptButton).toBeTruthy();
    expect(declineButton).toBeTruthy();
  });

  it('should not call close before buttons are clicked', () => {
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
