import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training',
  template: `
    <div>
      <h1 mat-dialog-title>Are you sure?</h1>
      <div mat-dialog-content>You already got {{ passedData.progress }}%</div>
      <div mat-dialog-actions>
        <div fxFlex fxLayoutAlign="space-evenly center">
          <button mat-raised-button [mat-dialog-close]="true">Yes</button>
          <button mat-raised-button [mat-dialog-close]="false">No</button>
        </div>
      </div>
    </div>
  `,
})
export class StopTrainingComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}
