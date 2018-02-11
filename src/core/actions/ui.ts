import { Action } from 'app/common/models/actions';

export const TOGGLE_SIDEBAR = 'core.ui.TOGGLE_SIDEBAR';
export const OPEN_SIDEBAR = 'core.ui.OPEN_SIDEBAR';
export const CLOSE_SIDEBAR = 'core.ui.CLOSE_SIDEBAR';

interface ToggleSidebar extends Action<typeof TOGGLE_SIDEBAR> {}
interface OpenSidebar extends Action<typeof OPEN_SIDEBAR> {}
interface CloseSidebar extends Action<typeof CLOSE_SIDEBAR> {}

export type All = (
  | ToggleSidebar
  | OpenSidebar
  | CloseSidebar
);

export function toggleSidebar(): ToggleSidebar {
  return {
    type: TOGGLE_SIDEBAR,
  };
}

export function openSidebar(): OpenSidebar {
  return {
    type: OPEN_SIDEBAR,
  };
}

export function closeSidebar(): CloseSidebar {
  return {
    type: CLOSE_SIDEBAR,
  };
}