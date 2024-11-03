import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { ChangeStatusComponent } from './change-status.component';
import {
  HistoryResponse,
  IncidentClosedError,
  IncidentNotFoundError,
  IncidentService,
} from '../incident.service';
import { SnackbarService } from '../../services/snackbar.service';

describe('ChangeStatusComponent', () => {
  let component: ChangeStatusComponent;
  let fixture: ComponentFixture<ChangeStatusComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ChangeStatusComponent>>;
  let incidentService: jasmine.SpyObj<IncidentService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    incidentService = jasmine.createSpyObj('IncidentService', ['changeStatusIncident']);
    snackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      imports: [ChangeStatusComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: IncidentService, useValue: incidentService },
        { provide: SnackbarService, useValue: snackbarService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close', () => {
    component.close();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should mark all fields as touched on invalid submit', () => {
    component.submit();
    expect(component.statusForm.touched).toBeTruthy();
  });

  it('should submit', () => {
    const comment = faker.lorem.sentence();
    component.statusForm.setValue({ status: 'escalated', comment });

    incidentService.changeStatusIncident.and.returnValue(of({} as HistoryResponse));

    component.submit();

    expect(snackbarService.showSuccess).toHaveBeenCalled();
  });

  [new IncidentClosedError(), new IncidentNotFoundError()].forEach(error => {
    it('should show error', () => {
      const comment = faker.lorem.sentence();
      component.statusForm.setValue({ status: 'escalated', comment });

      incidentService.changeStatusIncident.and.returnValue(throwError(() => error));

      component.submit();

      expect(snackbarService.showError).toHaveBeenCalled();
    });
  });
});
