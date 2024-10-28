import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service'; // Asegúrate de tener la ruta correcta

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [SnackbarService, { provide: MatSnackBar, useValue: snackBarSpy }],
    });

    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call MatSnackBar.open with success configuration', () => {
    const message = 'Operation successful';
    const duration = 3000;

    service.showSuccess(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Cerrar', {
      duration: duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  });

  it('should call MatSnackBar.open with error configuration', () => {
    const message = 'Operation failed';
    const duration = 5000;

    service.showError(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Cerrar', {
      duration: duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  });

  it('should use default duration for success', () => {
    const message = 'Operation successful';

    service.showSuccess(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Cerrar',
      jasmine.objectContaining({
        duration: 3000,
      }),
    );
  });

  it('should use default duration for error', () => {
    const message = 'Operation failed';

    service.showError(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Cerrar',
      jasmine.objectContaining({
        duration: 5000,
      }),
    );
  });

  it('should override default duration for success', () => {
    const message = 'Operation successful';
    const customDuration = 4000;

    service.showSuccess(message, customDuration);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Cerrar',
      jasmine.objectContaining({
        duration: customDuration,
      }),
    );
  });

  it('should override default duration for error', () => {
    const message = 'Operation failed';
    const customDuration = 6000;

    service.showError(message, customDuration);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Cerrar',
      jasmine.objectContaining({
        duration: customDuration,
      }),
    );
  });
});
