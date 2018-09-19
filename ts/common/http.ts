import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

/**
 * Get a new http client instance
 * @param options Axios request options
 */
export function httpClient(options?: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(options);
  // Workaround for https://github.com/axios/axios/issues/1158
  instance.interceptors.request.use(config => ({...config, method: config.method && config.method.toUpperCase()}));
  return instance;
}
