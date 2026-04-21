import { Module } from '@nestjs/common';
import { AuthModule } from '@org/auth';
import { AppCqrsModule } from '@org/core';

@Module({
  imports: [
    AppCqrsModule.forRoot(),
    AuthModule,
  ],
})
export class AppModule {}
