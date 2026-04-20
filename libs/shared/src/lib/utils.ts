export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
  },
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3;
  const initialDelay = options?.initialDelay ?? 1000;
  const maxDelay = options?.maxDelay ?? 10000;
  const backoffMultiplier = options?.backoffMultiplier ?? 2;

  let lastError: Error = new Error('Unknown error');

  const attempt = async (attemptNumber: number): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attemptNumber >= maxRetries) {
        throw lastError;
      }

      const delayMs = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attemptNumber),
        maxDelay,
      );
      await delay(delayMs);
      return attempt(attemptNumber + 1);
    }
  };

  return attempt(0);
}

export async function retryUntil<T>(
  fn: () => Promise<T>,
  predicate: (result: T) => boolean,
  options?: {
    maxAttempts?: number;
    delay?: number;
  },
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? 10;
  const delayMs = options?.delay ?? 1000;

  for (let i = 0; i < maxAttempts; i++) {
    const result = await fn();
    if (predicate(result)) {
      return result;
    }
    await delay(delayMs);
  }

  throw new Error(`Retry failed after ${maxAttempts} attempts`);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateNumericId(length: number = 6): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function truncate(
  str: string,
  maxLength: number,
  suffix = '...',
): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item);
      (acc[key] = acc[key] ?? []).push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function uniqueBy<T>(array: T[], keyFn: (item: T) => unknown): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
