import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@org/core';
import { PORT, ENV, GRPC, APP, VERSION } from '@org/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('USER_PORT') ?? PORT.USER;
  const restPath = ENV.REST_PATH;

  app.setGlobalPrefix(restPath);
  app.enableCors({ origin: APP.CORS_ORIGIN, credentials: true });

  await app.listen(port);
  Logger.log(`🚀 User v${VERSION.FULL} → http://localhost:${port}/${restPath}`);
}

bootstrap();
