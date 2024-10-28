import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from './dialog.services';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);

    TestBed.configureTestingModule({
      providers: [DialogService, { provide: MatDialog, useValue: spy }],
    });

    service = TestBed.inject(DialogService);
  });

  it('should close all dialogs', () => {
    const mockDialogRef1 = jasmine.createSpyObj('MatDialogRef', ['close']);
    const mockDialogRef2 = jasmine.createSpyObj('MatDialogRef', ['close']);

    service['dialogs'] = [mockDialogRef1, mockDialogRef2];

    service.closeAllDialogs();

    expect(mockDialogRef1.close).toHaveBeenCalled();
    expect(mockDialogRef2.close).toHaveBeenCalled();

    expect(service['dialogs']).toEqual([]);
  });
});
