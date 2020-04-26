import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app
    .useGlobalPipes(new ValidationPipe())
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .use(helmet())
    .use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
      })
    )
    .listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
