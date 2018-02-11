import * as React from 'react';
import { RouteComponentProps } from 'react-router';
/** Describes props from the parent component. These are the only props that the parent component must provide. */
export interface PublicProps { }

/** Describes props coming from React Router. These props will be available at props.match.params.   */
interface RouteProps { }

/** Ties all the all props together into a single type to pass to the component */
type Props = PublicProps & RouteComponentProps<RouteProps>;

/** Local state for this component */
export interface State { }

class RootComponent extends React.Component<Props, State> {
  // Create initial state
  public state: State = {};

  public componentDidMount() {

  }

  public render() {
    return (
      <h1>Hello World</h1>
    );
  }
}

export const Root: React.ComponentClass<PublicProps> = RootComponent;
