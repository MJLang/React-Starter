import * as React from 'react';
import { InferableComponentDecorator } from 'app/common/utils/inferable';
import { stringify } from 'query-string';
import { APIClient } from 'app/core/utils/client';
import * as merge from 'lodash.merge';

interface State {
  done: boolean;
  data: any;
}

interface DataOptions<P> {
  name?: string;
  url: string;
  params?: { [key: string]: any } | ((p: P) => { [key: string]: any });
  method?: string;
  query?: { [key: string]: any } | ((p: P) => { [key: string]: any });
}

export interface RemoteDataProps<T> {
  data: {
    done: boolean;
    data: T;
    refetch: (name?: string) => void;
    
  };
}

export function withData<P extends { data?: any }>(opts: DataOptions<P>): InferableComponentDecorator<P> {
  return (WrappedComponent: React.ComponentClass<P> | React.StatelessComponent<P>) => {
    class WithData extends React.Component<P, State> {
      constructor(props: P) {
        super(props);

        this.state = {
          done: false,
          data: undefined,
        };
      }

      public async componentDidMount() {
        return await this.fetch();
      }

      public render() {
        let injectedProps;
        if (opts.name) {
          injectedProps = {
            data: {
              [opts.name]: {
                done: this.state.done,
                data: this.state.data,
                refetch: this.refetch,
              },
            }
          };
        } else {
          injectedProps = {
            data: {
              done: this.state.done,
              data: this.state.data,
              refetch: this.refetch,
            },
          };
        }

        if (this.props.data) {
          injectedProps = merge(this.props, injectedProps);
        }

        return <WrappedComponent {...this.props} {...injectedProps} />;
      }

      private constructUrl() {
        let url = opts.url; 
        if (opts.params) {
          const params = this.getParams(opts.params, this.props);
          Object.keys(params).forEach((param) => {
            url = url.replace(`:${param}`, params && params[param]);
          });
        }

        if (opts.query) {
          const query = stringify(this.getQuery(opts.query, this.props));
          url = `${url}?${query}`;
        }
        return url;
      }

      private getParams(params: { [key: string]: any } | ((p: P) => { [key: string]: any }), props: P) {
        return typeof params === 'object' ? params : params(props);
      }

      private getQuery(query: { [key: string]: any } | ((p: P) => { [key: string]: any }), props: P) {
        return typeof query === 'object' ? query : query(props);
      }

      private fetch = async () => {
        const url = this.constructUrl();
        const result = await APIClient.request(url, {
          method: opts.method || 'GET',
        });

        if (result.status === 200) {
          this.setState({done: true, data: result.body});
        } else {
          this.setState({done: true});
        }
      }

      private refetch = async (name?: string) => {
        if (name && opts.name !== name) {
          return;
        }

        await this.fetch();
      }
    }
    // tslint:disable-next-line:no-any
    return WithData as any;
  };
}
