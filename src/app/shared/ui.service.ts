import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()
export class UIService {
  private apiCount = 0;

  constructor(
    private snackBar: MatSnackBar,
    private store: Store<{ UI: fromRoot.State }>
  ) {}

  showLoader() {
    if (this.apiCount === 0) {
      this.store.dispatch(new UI.StartLoading());
    }
    this.apiCount++;
  }

  hideLoader() {
    this.apiCount--;
    if (this.apiCount === 0) {
      this.store.dispatch(new UI.StopLoading());
    }
  }

  showSnackbar(
    message: string,
    type?: 'Error' | 'Success',
    duration: number = 3000
  ) {
    let panelClass:
      | 'app-notification-error'
      | 'app-notification-success'
      | undefined;
    if (type === 'Error') {
      panelClass = 'app-notification-error';
    } else if (type === 'Success') {
      panelClass = 'app-notification-success';
    }

    this.snackBar.open(message, undefined, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: panelClass,
      duration: duration,
    });
  }
}
