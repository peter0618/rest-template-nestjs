import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.model';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ResponseWrapper } from '../common/response.wrapper';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
// @ApiExtraModels(ResponseWrapper) // main.ts 파일의 extraModels: [ResponseWrapper] 설정으로 대체합니다.
@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 목록을 조회합니다.
   * TODO : 검색조건을 적용합니다. (https://github.com/typeorm/typeorm/issues/3103 참고)
   */
  @ApiOperation({ summary: '사용자 목록 조회 API', description: '사용자 목록을 조회합니다.' })
  @ApiOkResponse({ type: User, isArray: true })
  @Get()
  async getList(): Promise<[User]> {
    this.logger.debug(`getList()`);
    return await this.userService.getList();
  }

  /**
   * 사용자를 조회합니다.
   * @param id
   */
  @ApiOperation({ summary: '사용자 조회 API', description: '사용자를 조회합니다.' })
  // @ApiOkResponse({ type: User })
  @ApiOkResponse({
    description: '사용자 정보를 반환합니다.',
    schema: {
      $ref: `#/components/schemas/${User.name}`,
    },
  })
  @Get(':id')
  async getById(@Param('id') id: number): Promise<User> {
    this.logger.debug(`getById(id: ${id})`);
    return await this.userService.getById(id);
  }

  /**
   * 사용자를 생성합니다.
   * @param req
   */
  @ApiOperation({ summary: '사용자 생성 API', description: '사용자를 생성합니다.' })
  @ApiOkResponse({
    description: '생성된 사용자 정보를 반환합니다.',
    schema: {
      $ref: `#/components/schemas/${ResponseWrapper.name}`,
      properties: {
        data: {
          $ref: `#/components/schemas/${User.name}`,
        },
      },
    },
  })
  @UsePipes(new ValidationPipe())
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
  @ApiOperation({ summary: '사용자 정보 수정 API', description: '사용자 정보를 수정합니다.' })
  @ApiOkResponse({
    description: '수정된 사용자 정보를 반환합니다.',
    schema: {
      $ref: `#/components/schemas/${ResponseWrapper.name}`,
      properties: {
        data: {
          $ref: `#/components/schemas/${User.name}`,
        },
      },
    },
  })
  @UsePipes(new ValidationPipe())
  @Put(':id')
  async update(@Param('id') id: number, @Body() req: UpdateUserDto): Promise<ResponseWrapper<User>> {
    this.logger.debug(`update(id: ${id}, req: ${req})`);
    return await this.userService.update(id, req);
  }

  /**
   * 사용자를 삭제합니다. (soft delete 처리)
   * @param id
   */
  @ApiOperation({ summary: '사용자 정보 삭제 API', description: '사용자 정보를 삭제합니다.' })
  @ApiOkResponse({
    description: '삭제된 사용자 정보를 반환합니다.',
    schema: {
      $ref: `#/components/schemas/${ResponseWrapper.name}`,
      properties: {
        data: {
          $ref: `#/components/schemas/${User.name}`,
        },
      },
    },
  })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ResponseWrapper<User>> {
    this.logger.debug(`delete(id: ${id})`);
    return await this.userService.delete(id);
  }
}
