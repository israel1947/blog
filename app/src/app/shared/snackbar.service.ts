import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';


@Injectable({
  providedIn: 'root',
})
export class SnackbarService {

  private snackBar: MatSnackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog)
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  alertBar(message:string, action?:string, duration_number:any = 2){
    this.snackBar.open(message, action, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration:duration_number * 1000
      }); 
  }


  openDialog(enterAnimationDuration?: string, exitAnimationDuration?: string): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }


}
