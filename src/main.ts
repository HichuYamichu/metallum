import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import flash = require('connect-flash');
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 200,
    }),
  );
  app.use(
    session({
      secret: 'nest cats',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  await app.listen(3000);
}
bootstrap();
