import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpService {
  async get<T = unknown>(_url: string): Promise<T> {
    throw new Error('Http module requires axios package');
  }

  async post<T = unknown>(_url: string, _data?: unknown): Promise<T> {
    throw new Error('Http module requires axios package');
  }

  async put<T = unknown>(_url: string, _data?: unknown): Promise<T> {
    throw new Error('Http module requires axios package');
  }

  async patch<T = unknown>(_url: string, _data?: unknown): Promise<T> {
    throw new Error('Http module requires axios package');
  }

  async delete<T = unknown>(_url: string): Promise<T> {
    throw new Error('Http module requires axios package');
  }
}
