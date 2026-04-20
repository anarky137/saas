import { Injectable, Inject } from '@nestjs/common';
import { HttpModuleOptions, HTTP_MODULE_OPTIONS } from './http.interface';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  private readonly client: AxiosInstance;

  constructor(
    @Inject(HTTP_MODULE_OPTIONS)
    options: HttpModuleOptions,
  ) {
    this.client = axios.create({
      timeout: options?.timeout ?? 5000,
    });
  }

  get<T = unknown, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.client.get<T, R>(url, config);
  }

  post<T = unknown, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.client.post<T, R>(url, data, config);
  }

  put<T = unknown, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.client.put<T, R>(url, data, config);
  }

  patch<T = unknown, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.client.patch<T, R>(url, data, config);
  }

  delete<T = unknown, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.client.delete<T, R>(url, config);
  }
}
