import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigurationModule } from '../../configuration/configuration.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ConfigurationModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should be executed', async () => {
  //   await service.applyBcryptToPasswords();
  // });
});
