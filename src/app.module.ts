import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [ConfigurationModule, Logger],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
