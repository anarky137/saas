import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('AuthService');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Auth service running on port ${port}`);
}

bootstrap();
