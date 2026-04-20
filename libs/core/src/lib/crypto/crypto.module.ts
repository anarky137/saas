import { Global, Module, DynamicModule, ValueProvider } from '@nestjs/common';
import { CryptoService } from './crypto.service';

export interface CryptoModuleOptions {
  saltRounds?: number;
}

const CRYPTO_OPTIONS = 'CRYPTO_OPTIONS';

export const CryptoOptionsProvider: ValueProvider<CryptoModuleOptions> = {
  provide: CRYPTO_OPTIONS,
  useValue: {
    saltRounds: parseInt(process.env.CRYPTO_SALT_ROUNDS ?? '12'),
  },
};

@Global()
@Module({})
export class CryptoModule {
  static forRoot(options: CryptoModuleOptions = {}): DynamicModule {
    return {
      module: CryptoModule,
      providers: [
        {
          provide: CRYPTO_OPTIONS,
          useValue: {
            saltRounds:
              options.saltRounds ??
              parseInt(process.env.CRYPTO_SALT_ROUNDS ?? '12'),
          },
        },
        CryptoService,
      ],
      exports: [CryptoService, CRYPTO_OPTIONS],
    };
  }

  static forRootAsync(options: {
    useFactory: () => Promise<CryptoModuleOptions> | CryptoModuleOptions;
  }): DynamicModule {
    return {
      module: CryptoModule,
      providers: [
        {
          provide: CRYPTO_OPTIONS,
          useFactory: async () => {
            const opts = await options.useFactory();
            return {
              saltRounds:
                opts.saltRounds ??
                parseInt(process.env.CRYPTO_SALT_ROUNDS ?? '12'),
            };
          },
        },
        CryptoService,
      ],
      exports: [CryptoService, CRYPTO_OPTIONS],
    };
  }
}
