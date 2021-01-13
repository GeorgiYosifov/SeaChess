import * as fromActions from './auth.actions';

export interface IState {
  token: string;
  errorMessage: string;
}

const initialState: IState = {
  token: null,
  errorMessage: null
};

export function authReducer(state = initialState, action: fromActions.Actions): IState {
  switch (action.type) {

    case fromActions.ActionTypes.SetToken: {
      const { token } = (action as fromActions.SetToken).payload;
      return { ...state, token };
    }

    case fromActions.ActionTypes.RegisterSuccess: {
      const { token } = (action as fromActions.RegisterSuccess).payload;
      return { ...state, token };
    }

    case fromActions.ActionTypes.RegisterFailed: {
      const { error } = (action as fromActions.RegisterFailed).payload;
      return { ...state, errorMessage: error.description };
    }

    case fromActions.ActionTypes.LoginSuccess: {
      const { token } = (action as fromActions.LoginSuccess).payload;
      return { ...state, token };
    }

    case fromActions.ActionTypes.LoginFailed: {
      const { error } = (action as fromActions.LoginFailed).payload;
      return { ...state, errorMessage: error.description };
    }

    case fromActions.ActionTypes.LogoutSuccess: {
      return initialState;
    }
  }

  return state;
}
