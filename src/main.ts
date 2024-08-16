import * as Compressor from 'compression';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionGuard } from './guards/http.exception';
import { MongoExceptionFilter } from './guards/mongo.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/');
  app.useGlobalFilters(new HttpExceptionGuard(), new MongoExceptionFilter());
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });
  app.use(
    Compressor({
      level: -1,
    }),
  );
  await app.listen(app.get(ConfigService).get<number>('PORT'));
}
bootstrap();
