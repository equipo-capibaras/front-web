import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  // Define the properties your dialog data needs here
  email?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogs: MatDialogRef<any>[] = []; // You can specify a more precise type if needed

  constructor(private dialog: MatDialog) {}

  openDialog(component: any, data?: DialogData): MatDialogRef<any> {
    const dialogRef = this.dialog.open(component, { data });
    this.dialogs.push(dialogRef);

    dialogRef.afterClosed().subscribe(() => {
      this.closeDialog(dialogRef);
    });

    return dialogRef;
  }

  closeDialog(dialogRef: MatDialogRef<any>) {
    this.dialogs = this.dialogs.filter(d => d !== dialogRef);
  }

  closeAllDialogs() {
    this.dialogs.forEach(dialog => dialog.close());
    this.dialogs = [];
  }
}
