import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import * as argon2 from 'argon2';

export interface HashResult {
  hash: string;
  salt: string;
}

@Injectable()
export class CryptoService {
  async hash(password: string): Promise<HashResult> {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    return { hash, salt: '' };
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
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
