import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService, CorrelationIdInterceptor } from '@org/core';
import { PORT, ENV } from '@org/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('GATEWAY_PORT') ?? PORT.GATEWAY;
  const restPath = ENV.REST_PATH;

  app.setGlobalPrefix(restPath);
  app.enableCors({ origin: `http://localhost:${PORT.WEB}`, credentials: true });
  app.useGlobalInterceptors(new CorrelationIdInterceptor());

  await app.listen(port);
  Logger.log(`🚀 API Gateway → http://localhost:${port}/${restPath}`);
}

bootstrap();
