import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  email?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogs: MatDialogRef<DialogData>[] = [];

  constructor(private readonly dialog: MatDialog) {}

  closeAllDialogs() {
    this.dialogs.forEach(dialog => dialog.close());
    this.dialogs = [];
  }
}
