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

  it('should display company name and role', () => {
    const title = fixture.debugElement.query(By.css('h1')).nativeElement;
    const roleParagraph = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(title.textContent).toContain('Invitacion de la compañia Test Company');
    expect(roleParagraph.textContent).toContain('Role: Admin');
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
});
