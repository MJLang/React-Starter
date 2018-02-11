import { stringify } from 'query-string';

export function withQueryString(url: string, query: { [key: string]: any }) {
  return `${url}?${stringify(query)}`;
}
