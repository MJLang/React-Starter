import { applyMiddleware, compose, createStore, Reducer, Store } from 'redux';
import thunk from 'redux-thunk';
import { Config } from 'app/common/config';
import { Action, AsyncAction } from 'app/common/models/actions';
import { GlobalState } from 'app/common/models/global-state';
import { BuildType } from 'app/common/models/build-type';

declare const window: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
};

interface appState {
  [key: string]: object;
}

interface RegisterReducerAction extends Action<'app.registerReducer'> {
  name: string;
}

/**
 * Management class for the Twilight Redux store.
 */
export class AppStore {
  private reduxStore: Store<appState>;
  private reducers: { [key: string]: Reducer<{}> } = {};

  constructor(config: Config) {
    this.reduxStore = createStore(
      this.rootReducer,
      ((config.buildType !== BuildType.Production && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose)(
        applyMiddleware(thunk),
      ),
    );
  }

  /**
   * Returns the Redux store itself. You should never need to use this.
   */
  public getReduxStore() {
    return (this.reduxStore as {}) as Store<GlobalState>;
  }

  /**
   * Returns the current Redux state.
   */
  public getState() {
    return (this.reduxStore.getState() as {}) as GlobalState;
  }

  /**
   * Dispatch a Redux action.
   */
  public dispatch<T>(action: Action<T> | AsyncAction) {
    // We use any, so you don't have to.
    // tslint:disable-next-line:no-any
    return this.reduxStore.dispatch(action as any);
  }

  /**
   * Registers a new reducer on the state.
   *
   * @param key The state key to store the reducer's state under.
   * @param reducer The reducer itself.
   */
  public registerReducer<S>(key: string, reducer: Reducer<S>) {
    if (this.reducers[key]) {
      throw Error('Reducer already registered: ' + key);
    }

    this.reducers[key] = reducer;

    // Initialize newly registered reducers by firing an action
    this.dispatch({ type: 'app.registerReducer', name: key } as RegisterReducerAction);
  }

  /**
   * The rootReducer iterates all registered reducers and invokes them with
   * their state key, similar to combineReducers, but allowing a
   * registration pattern.
   */
  private rootReducer = (state: appState, action: RegisterReducerAction) => {
    if (!state) {
      state = {};
    }

    let nextState: appState = {};
    let hasChanged = false;
    switch (action.type) {
      case 'app.registerReducer': {
        const newState = this.reducers[action.name](state[action.name], { type: '@@INIT' });
        if (newState === undefined) {
          throw new Error(`Reducer for key ${action.name} returned undefined!`);
        }
        nextState = { ...state, [action.name]: newState };
        hasChanged = true;
        break;
      }
      default: {
        for (const key in this.reducers) {
          if (this.reducers[key]) {
            const newState = this.reducers[key](state[key], action);
            if (newState === undefined) {
              throw new Error(`Reducer for key ${key} returned undefined!`);
            }

            nextState[key] = newState;
            hasChanged = hasChanged || newState !== state[key];
          }
        }
        break;
      }
    }

    return hasChanged ? nextState : state;
  }
}
