import { Action } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_TRAININGS = '[TRAINING] Set Available Trainings';
export const SET_FINISHED_TRAININGS = '[TRAINING] Set Finished Trainings';
export const START_TRAINING = '[TRAINING] Start Training';
export const STOP_TRAINING = '[TRAINING] Stop Training';

export class SetAvailableTrainings implements Action {
  readonly type = SET_AVAILABLE_TRAININGS;

  constructor(public readonly payload: Exercise[]) {}
}

export class SetFinishedExercises implements Action {
  readonly type = SET_FINISHED_TRAININGS;

  constructor(public readonly payload: Exercise[]) {}
}

export class StartTraining implements Action {
  readonly type = START_TRAINING;

  constructor(public readonly payload: string) {}
}

export class StopTraining implements Action {
  readonly type = STOP_TRAINING;
}

export type TrainingActions =
  | SetAvailableTrainings
  | SetFinishedExercises
  | StartTraining
  | StopTraining;
