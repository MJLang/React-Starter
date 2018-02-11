import { app } from 'app/core/app';
import { stringify as qsStringify } from 'query-string';

export const JSON_CONTENT_TYPE = 'application/json';
interface Headers {
  [name: string]: string;
}

interface Options extends RequestInit {
  headers?: Headers;
}

export interface GETOptions extends Options {
  method?: 'GET';
}

export interface PUTOptions extends Options {
  method?: 'PUT';
  body?: any;
}

export interface POSTOptions extends Options {
  method?: 'POST';
  body?: any;
}

export interface DELETEOptions extends Options {
  method?: 'DELETE';
  body?: any;
}

interface APIResponse<T> {
  status: number;
  body?: T;
  error?: any;
  requestError?: Error;
}

export class APIClient {
  public static async get<T>(path: string, options: GETOptions = {}) {
    return await this.request<T>(path, {
      ...options,
      method: 'GET'
    });
  }

  public static async put<T>(path: string, options: PUTOptions = {}) {
    return await this.request<T>(path, {
      ...options,
      method: 'PUT'
    });
  }

  public static async post<T>(path: string, options: POSTOptions = {}) {
    return await this.request<T>(path, {
      ...options,
      method: 'POST'
    });
  }

  public static async delete<T>(path: string, options: DELETEOptions = {}) {
    return await this.request<T>(path, {
      ...options,
      method: 'DELETE'
    });
  }

  public static async request<T>(path: string, options: Options = {}) {
    options = this.constructOptions(options);
    const contentType = options.headers ? options.headers['Content-Type'] : undefined;
    options.body = this.serialize(options.body, contentType);
    const res: Response = await this._fetch(path, options);
    return await this.constructAPIResponse<T>(res);
  }
  private static constructOptions<T extends Options>(options: T) {
    options = Object.assign({}, options, {
      headers: {
        ...this.getDefaultHeaders(options),
        ...options.headers
      }
    });

    return options;
  }

  private static async _fetch(path: string, options: Options = {}): Promise<Response> {
    return await fetch(this.getAPIUrl(path).toString(), options);
  }

  private static async constructAPIResponse<T extends {}>(res: Response) {
    const apiResponse: APIResponse<T> = {
      status: res.status
    };

    try {
      const body = await res.json();
      if (res.ok) {
        apiResponse.body = body as T;
      } else {
        apiResponse.error = body;
      }
    } catch (err) {
      apiResponse.requestError = err;
    }

    return apiResponse;
  }

  private static getAPIUrl(path: string): URL {
    return new URL(path, app.config.apiURL);
  }

  private static serialize(body: any, contentType?: string) {
    if (contentType === 'application/json') {
      return JSON.stringify(body);
    } else if (contentType === 'application/x-www-form-urlencoded') {
      return qsStringify(body);
    } else {
      return body;
    }
  }

  private static getDefaultHeaders(options: Options) {

    const headers: Headers = {
      Accept: 'application/json',
      'Accept-Language': 'en-us',
      'X-Requested-With': 'XMLHttpRequest'
    };

    if (!options.body) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }
}
