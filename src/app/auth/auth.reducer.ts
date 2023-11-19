import {
  AuthActions,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
} from './auth.actions';

export interface State {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
}

const initialState: State = {
  isAuthenticated: false,
  userId: null,
  userEmail: null,
};

export function authReducer(state = initialState, action: AuthActions): State {
  switch (action.type) {
    case SET_AUTHENTICATED: {
      return {
        ...state,
        isAuthenticated: true,
        userId: action.payload.userId,
        userEmail: action.payload.userEmail,
      };
    }
    case SET_UNAUTHENTICATED: {
      return {
        ...state,
        isAuthenticated: false,
        userId: null,
        userEmail: null,
      };
    }

    default:
      return state;
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
export const getUserID = (state: State) => state.userId;
export const getUserEmail = (state: State) => state.userEmail;
