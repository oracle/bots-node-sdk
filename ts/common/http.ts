import fetch from 'node-fetch';

/**
 * Get a new http client instance
 */
export function httpClient(): (url: string, options?: Request) => Promise<Response> {
  return (url: string, options?: any): Promise<Response> => {
    return fetch(url, options)
      .then((res: Response) => {
        return res.ok ? res : Promise.reject(new Error(`${res.status}: ${res.statusText}`))
      });
  }
}
