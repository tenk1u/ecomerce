import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.enableCors();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
