import * as React from 'react';

interface ComponentProps {
  /**
   * Called when a click event originates outside the container
   */
  onClickOut: (e: MouseEvent) => void;
}

type Props = ComponentProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * This component creates a container element and notifies the owner when a
 * user clicks outside of it. This is useful for things like closing menus when
 * a user clicks anywhere else on the page.
 *
 * Usage:
 *
 *   <ClickOutDetector onClickOut={this.handleClickOut}>
 *    <h1>My Great Menu</h1>
 *   </ClickOutDetector>
 */
export class ClickOutDetector extends React.Component<Props, {}> {
  private container?: HTMLElement | null;

  public componentDidMount() {
    // Capture this event before any children have a chance to.
    // This prevents child button actions from changing the DOM,
    // which could lead to a null target when this event is handled.
    document.addEventListener('click', this.handleGlobalClick, true);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.handleGlobalClick, true);
  }

  public render() {
    const { onClickOut, ...containerProps } = this.props;

    return (
      <div {...containerProps} ref={this.setContainerRef}>
        {this.props.children}
      </div>
    );
  }

  private setContainerRef = (container: HTMLElement | null) => {
    this.container = container;
  }

  private handleGlobalClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!this.isParentOf(target)) {
      this.props.onClickOut(e);
    }
  }

  private isParentOf(target: HTMLElement): boolean {
    let currentTarget: HTMLElement | null = target;

    while (currentTarget) {
      if (currentTarget === this.container) {
        return true;
      }

      currentTarget = currentTarget.parentElement;
    }

    return false;
  }
}
