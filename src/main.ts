import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 200,
    }),
  );
  await app.listen(3000);
}
bootstrap();