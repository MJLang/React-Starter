import { Config } from 'app/common/config';
import { AppStorage } from 'app/core/utils/app-storage';
import { AppStore } from 'app/core/app-store';
import * as ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';

export let app: App;
export let config: typeof app.config;
export let storage: typeof app.storage;

export function initapp(configuration: Config) {
  app = new App(configuration);

  config = app.config;
  storage = app.storage;
}

export class App {
  public config: Config;
  public storage: AppStorage;
  public store: AppStore;
  public history = createBrowserHistory();

  constructor(configuration: Config) {
    this.config = configuration;
    this.store = new AppStore(this.config);

  }

  public mount(element: JSX.Element, rootElement: HTMLElement) {
    ReactDOM.render(element, rootElement);
  }
}
