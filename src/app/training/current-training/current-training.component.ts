import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';
import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
})
export class CurrentTrainingComponent {
  progress = 0;
  timer: any;

  constructor(
    private dialog: MatDialog,
    private trainingSvc: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (!!ex) {
          const step = (ex.duration / 100) * 1000;
          this.timer = setInterval(() => {
            this.progress += 1;
            if (this.progress >= 100) {
              this.trainingSvc.completeExercise();
              clearInterval(this.timer);
            }
          }, step);
        }
      });
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: { progress: this.progress },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.trainingSvc.cancelExercise(this.progress);
        this.progress = 0;
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
