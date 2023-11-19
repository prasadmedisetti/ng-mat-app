import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface State {
  UI: fromUi.State;
  AUTH: fromAuth.State;
}

export const reducers: ActionReducerMap<State, any> = {
  UI: fromUi.uiReducer,
  AUTH: fromAuth.authReducer,
};

export const getUiState = createFeatureSelector<fromUi.State>('UI');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('AUTH');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);
export const getUserID = createSelector(getAuthState, fromAuth.getUserID);
export const getUserEmail = createSelector(getAuthState, fromAuth.getUserEmail);
