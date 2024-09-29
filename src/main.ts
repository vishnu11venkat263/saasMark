import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';

async function bootstrap(): Promise<Server> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001); // You can set your own port if needed
  return app.getHttpAdapter().getInstance();
}

export default bootstrap();

