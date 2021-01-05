import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './modules/user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(process.env.APP_NAME),
  });

  const logger = app.get<Logger, Logger>(Logger);

  const port = process.env.APP_PORT || 3000;

  const options = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [UserModule]
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    logger.setContext('APP');
    logger.log(`Server is listening on : ${port}`);
  });
}

(async () => {
  await bootstrap();
})();
