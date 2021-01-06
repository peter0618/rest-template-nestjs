import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DBName, MySQLDMLResult } from '../database/database.model';
import { Connection } from 'typeorm';
import { User } from './model/user.model';
import { JsonUtil } from '../common/util/json.util';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ResponseWrapper } from '../common/response.wrapper';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(@InjectConnection(DBName.TEST_DB) private readonly connection: Connection) {}

  /**
   * 사용자 목록을 조회합니다.
   */
  async getList(): Promise<[User]> {
    try {
      // fixme : 날짜를 RFC3339 format 으로 변환해서 response 하는 방법을 적용해야 합니다.
      const rawRows = await this.connection.query(`
select id,
       name,
       phone,
       email,
       is_used,
       is_deleted,
       date_format(updated_at, '%Y-%m-%d') as updated_at,
       date_format(created_at, '%Y-%m-%d') as created_at
  from user`);

      const rows = JsonUtil.snakeToCamelCase(rawRows);

      return rows.map(row => {
        const { id, name, phone, email, isUsed, isDeleted, updatedAt, createdAt } = row;

        return {
          id,
          name,
          phone,
          email,
          isUsed: isUsed == 1,
          isDeleted: isDeleted == 1,
          updatedAt,
          createdAt,
        };
      });
    } catch (e) {
      this.logger.error(e.toString());
    }

    return null;
  }

  /**
   * 사용자를 조회합니다.
   */
  async getById(id: number): Promise<User> {
    try {
      // fixme : 날짜를 RFC3339 format 으로 변환해서 response 하는 방법을 적용해야 합니다.
      const rawRows = await this.connection.query(
        `
select id,
       name,
       phone,
       email,
       is_used,
       is_deleted,
       date_format(updated_at, '%Y-%m-%d') as updated_at,
       date_format(created_at, '%Y-%m-%d') as created_at
  from user
 where id in (?)`,
        [id],
      );

      const row = JsonUtil.snakeToCamelCase(rawRows[0]);

      const { name, phone, email, isUsed, isDeleted, updatedAt, createdAt } = row;

      return {
        id,
        name,
        phone,
        email,
        isUsed: isUsed == 1,
        isDeleted: isDeleted == 1,
        updatedAt,
        createdAt,
      };
    } catch (e) {
      this.logger.error(e.toString());
    }

    return null;
  }

  /**
   * 사용자를 생성합니다.
   * @param req
   */
  async create(req: CreateUserDto): Promise<ResponseWrapper<User>> {
    try {
      const { name, email, phone } = req;
      const result: MySQLDMLResult = await this.connection.query(
        `
insert into user 
(name, phone, email) 
values (?, ?, ?) 
      `,
        [name, phone, email],
      );
      this.logger.debug(`사용자 생성 결과 : ${JSON.stringify(result)}`);

      const user = Object.assign(new User(), req);
      user.id = result.insertId;

      return new ResponseWrapper<User>().setData(user);
    } catch (e) {
      this.logger.error(e.toString());
      // TODO : 개발/운영 환경에 따른 에러로그 분리 (개발 환경에서는 더 상세한 정보를 내려주기)
      return new ResponseWrapper<User>().fail().setMessage('user create error');
    }
  }

  /**
   * 사용자 정보를 수정합니다.
   * @param id
   * @param req
   */
  async update(id: number, req: UpdateUserDto): Promise<ResponseWrapper<User>> {
    try {
      const { name, email, phone } = req;

      // TODO : 이름이나 전화번호 등에 unique 조건을 주고 중복확인을 하는 로직을 추가합니다.

      const result: MySQLDMLResult = await this.connection.query(
        `
update user
   set name = ?,
       phone = ?,
       email = ?
 where id = ?  
      `,
        [name, phone, email, id],
      );
      this.logger.debug(`사용자 정보 수정 결과 : ${JSON.stringify(result)}`);

      const user = Object.assign(new User(), req);
      user.id = id;

      return new ResponseWrapper<User>().setData(user);
    } catch (e) {
      this.logger.error(e.toString());
      return new ResponseWrapper<User>().fail().setMessage('user update error');
    }
  }
}
