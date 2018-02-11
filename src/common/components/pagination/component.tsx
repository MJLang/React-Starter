import * as React from 'react';
import './styles.scss';

/** Describes props from the parent component. These are the only props that the parent component must provide. */
export interface PublicProps {
  currentPage: number;
  totalCount: number;
  countPer?: number;
  onPrev: () => void;
  onNext: () => void;
  
}

const DEFAULT_COUNT = 25;

/** Ties all the all props together into a single type to pass to the component */
type Props = PublicProps;

/** Local state for this component */
export interface State {}

class PaginationComponent extends React.Component<Props, State> {
  // Create initial state
  public state: State = {};

  public componentDidMount() {

  }

  public render() {
    const canNext = this.canNext();
    const canPrev = this.canPrev();

    console.log('PAG', {
      canNext,
      canPrev
    })
    return (
      <div className="pagination">
        <button disabled={!canPrev} onClick={this.props.onPrev} className="button is-primary pagination__prev">Previous</button>
        <button disabled={!canNext} onClick={this.props.onNext} className="button is-primary pagination__next">Next</button>
      </div>
    );
  }

  private canPrev = () => {
    return this.props.currentPage > 1;
  }

  private canNext = () => {
    let lastItem = this.props.currentPage * (this.props.countPer || DEFAULT_COUNT);
    return lastItem < this.props.totalCount;
  }
}

export const Pagination: React.ComponentClass<PublicProps> = PaginationComponent;
