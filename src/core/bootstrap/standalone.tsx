/**
 *  Entry point for standalone app.
 */
import * as React from 'react';
import { Router } from 'react-router';
import { app } from 'app';
import { Root } from 'app/pages/root';
import { Provider } from 'react-redux';
import 'app/common/all.scss';

function mount() {
  app.mount((
    <Provider store={app.store.getReduxStore()}>
      <Router history={app.history}>
        <Root />
      </Router>
    </Provider>
  ), document.getElementById('root')!);
}

mount();