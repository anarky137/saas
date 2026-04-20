import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';

export interface HashResult {
  hash: string;
  salt: string;
}

@Injectable()
export class CryptoService {
  async hash(_password: string): Promise<HashResult> {
    throw new Error('Crypto module requires bcrypt package');
  }

  async compare(_password: string, _hash: string): Promise<boolean> {
    throw new Error('Crypto module requires bcrypt package');
  }

  generateToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('base64url');
  }

  hashSha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  hashSha512(data: string): string {
    return createHash('sha512').update(data).digest('hex');
  }

  md5(data: string): string {
    return createHash('md5').update(data).digest('hex');
  }
}
