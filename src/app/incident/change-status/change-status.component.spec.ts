import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeStatusComponent } from './change-status.component';
import { IncidentResponse, IncidentService } from '../incident.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { convertToParamMap } from '@angular/router';

describe('ChangeStatusComponent', () => {
  let component: ChangeStatusComponent;
  let fixture: ComponentFixture<ChangeStatusComponent>;
  let incidentService: jasmine.SpyObj<IncidentService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ChangeStatusComponent>>;

  beforeEach(async () => {
    const incidentServiceSpy = jasmine.createSpyObj('IncidentService', ['changeStatusIncident']);
    const snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', [
      'showSuccess',
      'showError',
    ]);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const activatedRouteSpy = {
      snapshot: {
        paramMap: convertToParamMap({ id: '1' }), // Mocking the paramMap with an id
      },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ChangeStatusComponent],
      providers: [
        { provide: IncidentService, useValue: incidentServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: { status: '', comment: '', incident_id: '1' } }, // Ensure incident_id is set
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeStatusComponent);
    component = fixture.componentInstance;
    incidentService = TestBed.inject(IncidentService) as jasmine.SpyObj<IncidentService>;
    snackbarService = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ChangeStatusComponent>>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    component.ngOnInit();
    expect(component.statusForm.value).toEqual({
      status: '',
      comment: '',
      incident_id: '1',
    });
  });

  it('should patch form values when data is provided', () => {
    component.data = { status: 'escalated', comment: 'Test comment', incident_id: '1' };
    component.ngOnInit();
    expect(component.statusForm.value).toEqual({
      status: 'escalated',
      comment: 'Test comment',
      incident_id: '1',
    });
  });

  it('should call changeStatusIncident and show success message on valid form submission', () => {
    component.statusForm.setValue({
      status: 'escalated',
      comment: 'Test comment',
      incident_id: '1',
    });
    incidentService.changeStatusIncident.and.returnValue(of({} as IncidentResponse));

    component.onSubmit();

    expect(snackbarService.showSuccess).toHaveBeenCalledWith(
      'Se ha cambiado el estado exitosamente.',
    );
    expect(dialogRef.close).toHaveBeenCalledWith(component.statusForm.value);
  });

  it('should show error message when changeStatusIncident fails', () => {
    component.statusForm.setValue({
      status: 'escalated',
      comment: 'Test comment',
      incident_id: '1',
    });
    incidentService.changeStatusIncident.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(snackbarService.showError).toHaveBeenCalledWith(
      'Ocurrió un error al cambiar el estado.',
    );
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
