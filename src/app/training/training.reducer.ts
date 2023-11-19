import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';
import {
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING,
  TrainingActions,
} from './training.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise | undefined;
}

export interface State extends fromRoot.State {
  Training: TrainingState;
}

export function determineIfExercise(
  toBeDetermined: Exercise | undefined
): toBeDetermined is Exercise {
  if ((toBeDetermined as Exercise)?.name) {
    return true;
  }
  return false;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: undefined,
};

export function trainingReducer(
  state = initialState,
  action: TrainingActions
): TrainingState {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS: {
      return { ...state, availableExercises: action.payload };
    }
    case SET_FINISHED_TRAININGS: {
      return { ...state, finishedExercises: action.payload };
    }
    case START_TRAINING: {
      const selectedExercise = state.availableExercises.find(
        (ex) => ex.id === action.payload
      );
      return {
        ...state,
        activeTraining: determineIfExercise(selectedExercise)
          ? selectedExercise
          : undefined,
      };
    }
    case STOP_TRAINING: {
      return { ...state, activeTraining: undefined };
    }

    default:
      return state;
  }
}

export const getTrainingState =
  createFeatureSelector<TrainingState>('TRAINING');
export const getAvailableExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercises
);
export const getFinishedExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.finishedExercises
);
export const getActiveTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining
);
export const getIsTrainingActive = createSelector(
  getTrainingState,
  (state: TrainingState) => Boolean(state.activeTraining)
);
