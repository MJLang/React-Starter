import * as uiActions from 'app/core/actions/ui';
import { app } from 'app';
import { GlobalState } from 'app/common/models/global-state';
export interface UIState {
  sidebarOpen: boolean;
}

export const getInitialState = (): UIState => ({
  sidebarOpen: false,
});

export function uiReducer(state: UIState = getInitialState(), action: uiActions.All): UIState {
  switch (action.type) {
    case uiActions.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    case uiActions.OPEN_SIDEBAR:
      return {
        ...state,
        sidebarOpen: true,
      };
    case uiActions.CLOSE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: false,
      };
    default:
      return state;
  }
}

export function getSidebarState(state: GlobalState): boolean {
  return state.ui.sidebarOpen;
}

app.store.registerReducer('ui', uiReducer);
