import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog',
    imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>) ;

  constructor(@Inject(MAT_DIALOG_DATA) 
  public data: {
    title:string, 
    message:string, 
    icon?:string, 
    classCustom?:string,
    buttonAcept:string,
    buttonCancel:string,
    contextClass?:string,
    titlePost?:string
  }
) { }
}
