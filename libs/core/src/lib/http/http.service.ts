import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface HttpModuleOptions {
  timeout?: number;
  retries?: number;
  baseURL?: string;
  headers?: Record<string, string>;
}

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);
  private readonly client: AxiosInstance;

  constructor(options: HttpModuleOptions = {}) {
    this.client = axios.create({
      timeout: options.timeout ?? 5000,
      baseURL: options.baseURL,
      headers: options.headers,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        this.logger.error(`HTTP Error: ${error.message}`);
        return Promise.reject(error);
      },
    );
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}
