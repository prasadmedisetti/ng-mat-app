import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Observable, Subscription, map, take } from 'rxjs';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/compat/firestore';

import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as TRAINING from './training.actions';
import * as fromRoot from '../app.reducer';
import * as fromTraining from './training.reducer';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  fbSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiSvc: UIService,
    private authSvc: AuthService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.uiSvc.showLoader();
    this.fbSubscriptions.push(
      this.db
        .collection('availableExercises')
        // .valueChanges({ idField: 'id' })
        .snapshotChanges()
        .pipe(
          map((docArray: any[]) => {
            return docArray.map((doc: DocumentChangeAction<any>) => ({
              id: doc.payload.doc.id,
              name: doc.payload.doc.data().name,
              duration: doc.payload.doc.data().duration,
              calories: doc.payload.doc.data().calories,
            }));
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.uiSvc.hideLoader();
            this.store.dispatch(new TRAINING.SetAvailableTrainings(exercises));
          },
          (error) => {
            this.uiSvc.hideLoader();
            this.uiSvc.showSnackbar(
              'Fetching exercises failed, Please try again later!',
              'Error'
            );
            this.store.dispatch(new TRAINING.SetAvailableTrainings([]));
          }
        )
    );
  }

  startExercise(selectedId: string) {
    // this.db.doc(`availableExercises/${selectedId}`).update({ lastSelected: new Date() });
    this.store.dispatch(new TRAINING.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (!!ex) {
          this.addDataToDatabase({
            ...ex,
            date: new Date(),
            state: 'Completed',
          });
          this.store.dispatch(new TRAINING.StopTraining());
        }
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (!!ex) {
          this.addDataToDatabase({
            ...ex,
            duration: ex.duration * (progress / 100),
            calories: ex.calories * (progress / 100),
            date: new Date(),
            state: 'Cancelled',
          });
          this.store.dispatch(new TRAINING.StopTraining());
        }
      });
  }

  fetchCompletedOrCancelledExercises() {
    this.uiSvc.showLoader();
    this.store
      .select(fromRoot.getUserID)
      .pipe(take(1))
      .subscribe((userId) => {
        if (userId) {
          this.fbSubscriptions.push(
            (
              this.db
                .collection('finishedExercises', (ref) =>
                  ref.where('userId', '==', userId)
                )
                .valueChanges() as Observable<Exercise[]>
            ).subscribe((exercises: Exercise[]) => {
              this.uiSvc.hideLoader();
              this.store.dispatch(
                new TRAINING.SetFinishedExercises(
                  exercises.map((e: any) => ({ ...e, date: e.date.toDate() }))
                )
              );
            })
          );
        }
      });
  }

  cancelSubscriptions() {
    this.fbSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.uiSvc.showLoader();
    this.store
      .select(fromRoot.getUserID)
      .pipe(take(1))
      .subscribe((userId) => {
        if (userId) {
          this.db.collection('finishedExercises').add({
            ...exercise,
            userId,
          });
        }
      });
    this.uiSvc.hideLoader();
  }
}
