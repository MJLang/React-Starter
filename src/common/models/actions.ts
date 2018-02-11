import { ThunkAction } from 'redux-thunk';
import { GlobalState } from './global-state';

export interface Action<T> {
  type: T;
}

export type AsyncAction<T = void> = ThunkAction<T, GlobalState, {}>;
