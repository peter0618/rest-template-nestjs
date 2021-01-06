import { Body, Controller, Delete, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.model';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ResponseWrapper } from '../common/response.wrapper';

@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 목록을 조회합니다.
   * TODO : 검색조건을 적용합니다. (https://github.com/typeorm/typeorm/issues/3103 참고)
   */
  @Get()
  async getList(): Promise<[User]> {
    this.logger.debug(`getList()`);
    return await this.userService.getList();
  }

  /**
   * 사용자를 조회합니다.
   * @param id
   */
  @Get(':id')
  async getById(@Param('id') id: number): Promise<User> {
    this.logger.debug(`getById(id: ${id})`);
    return await this.userService.getById(id);
  }

  /**
   * 사용자를 생성합니다.
   * @param req
   */
  @Post()
  async create(@Body() req: CreateUserDto): Promise<ResponseWrapper<User>> {
    this.logger.debug(`create(req: ${JSON.stringify(req)})`);
    return await this.userService.create(req);
  }

  /**
   * 사용자 정보를 수정합니다.
   * @param id
   * @param req
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() req: UpdateUserDto): Promise<ResponseWrapper<User>> {
    this.logger.debug(`update(id: ${id}, req: ${req})`);
    return await this.userService.update(id, req);
  }

  /**
   * 사용자를 삭제합니다. (soft delete 처리)
   * TODO : 작성해야 합니다.
   * @param id
   */
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return null;
  }
}
