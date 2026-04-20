import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';

export interface HashResult {
  hash: string;
  salt: string;
}

@Injectable()
export class CryptoService {
  private readonly SALT_ROUNDS = 12;

  async hash(password: string): Promise<HashResult> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
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
