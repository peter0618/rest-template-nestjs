import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(process.env.APP_NAME),
  });

  const logger = app.get<Logger, Logger>(Logger);

  const port = process.env.APP_PORT || 3000;
  await app.listen(port, () => {
    logger.setContext('APP');
    logger.log(`Server is listening on : ${port}`);
  });
}

(async () => {
  await bootstrap();
})();
