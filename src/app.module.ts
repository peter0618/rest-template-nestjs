import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigurationModule, Logger, DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
