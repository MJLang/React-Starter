/**
 * Shamelessly lifted from an earlier version of the Redux typings.
 */
import * as React from 'react';

type Component<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

export interface InferableComponentDecorator<P> {
  <T extends Component<P>>(component: T): T;
}
