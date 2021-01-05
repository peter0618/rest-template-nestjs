import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBName } from './database.model';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DBName.TEST_DB, // @InjectConnection(DBName.TEST_DB) 으로 의존성을 주입할 수 있습니다.
      inject: [ConfigService], // AppModule 에서 global 로 설정되어있기 때문에 이렇게 inject 가 가능합니다.
      useFactory: (configService: ConfigService) => {
        const appEnv = configService.get<string>('APP_ENV');

        const databaseHostFor = configService.get<string>('MYSQL_TEST_HOST') || 'localhost';
        const databasePortFor = configService.get<string>('MYSQL_TEST_PORT') || '3306';
        const databaseUserFor = configService.get<string>('MYSQL_TEST_USER') || 'root';
        const databaseUserPasswordFor = configService.get<string>('MYSQL_TEST_PASS') || '';
        const databaseName = configService.get<string>('MYSQL_TEST_DATABASE_NAME') || 'sys';

        const isDevelopment = appEnv === 'dev';

        return {
          // dbms 유형
          type: 'mysql',
          debug: false,
          logging: isDevelopment ? ['error', 'warn'] : ['info'],
          // TODO timezone (Asia/Seoul) 을 아래처럼 offset (+09:00) 으로 변경할 수 있는지 확인해보자.
          timezone: '+09:00',
          host: databaseHostFor,
          port: Number.parseInt(databasePortFor, 10),
          username: databaseUserFor,
          password: databaseUserPasswordFor,
          database: databaseName,
          extra: {
            // The maximum number of connections to create at once. (Default: 10)
            // TODO 이게 적용되는지 확인해봐야합니다.
            connectionLimit: 10,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
