import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Metallum')
    .setDescription('The Metallum API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

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
