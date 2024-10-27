import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMessageComponent } from './invite-message.component';

describe('InviteMessageComponent', () => {
  let component: InviteMessageComponent;
  let fixture: ComponentFixture<InviteMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
