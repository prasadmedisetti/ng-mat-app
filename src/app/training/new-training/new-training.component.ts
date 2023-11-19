import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  exercisesSubsscription!: Subscription;

  constructor(
    private trainingSvc: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.exercisesSubsscription = this.store
      .select(fromTraining.getAvailableExercises)
      .subscribe((exercises) => (this.exercises = exercises));
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingSvc.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingSvc.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exercisesSubsscription) {
      this.exercisesSubsscription.unsubscribe();
    }
  }
}
