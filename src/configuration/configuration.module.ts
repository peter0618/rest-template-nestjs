import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // 프로젝트 root 폴더에 있는 .env 파일에 정의된 환경변수를 application 에서 사용할 수 있도록 설정합니다.
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class ConfigurationModule {}
