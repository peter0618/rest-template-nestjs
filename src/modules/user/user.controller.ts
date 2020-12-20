import { Controller, Get, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.model';

@Controller('user')
export class UserController {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 목록을 조회합니다.
   */
  @Get()
  async getList(): Promise<[User]> {
    this.logger.debug(`getList()`);
    return await this.userService.getList();
  }
}
