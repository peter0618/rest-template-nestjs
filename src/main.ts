import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './modules/user/user.module';
import { ResponseWrapper } from './modules/common/response.wrapper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(process.env.APP_NAME),
  });

  const logger = app.get<Logger, Logger>(Logger);

  const port = process.env.APP_PORT || 3000;

  const options = new DocumentBuilder()
    .setTitle('Rest template')
    .setDescription('The rest template API description')
    .setVersion('1.0')
    // .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [UserModule],
    extraModels: [ResponseWrapper], // 여기에 이렇게 선언해주지 않으면, 각각의 Controller 에 @ApiExtraModels 로 model 을 추가해주어야 swagger 에서 참조할 수 있습니다.
  });
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, () => {
    logger.setContext('APP');
    logger.log(`Server is listening on : ${port}`);
  });
}

(async () => {
  await bootstrap();
})();
