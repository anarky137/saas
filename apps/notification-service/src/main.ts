import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@org/core';
import { PORT, ENV, APP, VERSION } from '@org/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('NOTIFICATION_PORT') ?? PORT.NOTIFICATION;

  app.setGlobalPrefix(ENV.REST_PATH);
  app.enableCors({ origin: APP.CORS_ORIGIN, credentials: true });

  await app.listen(port);
  Logger.log(`🚀 Notification v${VERSION.FULL} → http://localhost:${port}/${ENV.REST_PATH}`);
}

bootstrap();
