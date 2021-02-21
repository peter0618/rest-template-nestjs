import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DBName, MySQLDMLResult } from '../database/database.model';
import { Connection } from 'typeorm';
import { User } from './model/user.model';
import { JsonUtil } from '../common/util/json.util';
import { CreateUserDto, PatchUserDto, UpdateUserDto } from './dto/user.dto';
import { ResponseWrapper } from '../common/response.wrapper';
import { hash } from '../common/util/cipher';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(@InjectConnection(DBName.TEST_DB) private readonly connection: Connection) {}

  /**
   * 사용자 목록을 조회합니다.
   * - 삭제되지 않은 사용자만 조회됩니다.
   * TODO : 검색조건을 추가해야 합니다.
   */
  async getList(): Promise<[User]> {
    try {
      // fixme : 날짜를 RFC3339 format 으로 변환해서 response 하는 방법을 적용해야 합니다.
      const rawRows = await this.connection.query(`
select id,
       name,
       phone,
       email,
       date_format(birthday, '%Y-%m-%d') as birthday,
       is_used,
       is_deleted,
       date_format(updated_at, '%Y-%m-%d') as updated_at,
       date_format(created_at, '%Y-%m-%d') as created_at
  from user
 where is_used is true
   and is_deleted is false`);

      const rows = JsonUtil.snakeToCamelCase(rawRows);

      return rows.map(row => {
        const { id, name, phone, email, birthday, isUsed, isDeleted, updatedAt, createdAt } = row;

        return {
          id,
          name,
          phone,
          email,
          birthday,
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
       date_format(birthday, '%Y-%m-%d') as birthday,
       is_used,
       is_deleted,
       date_format(updated_at, '%Y-%m-%d') as updated_at,
       date_format(created_at, '%Y-%m-%d') as created_at
  from user
 where id in (?)`,
        [id],
      );

      const row = JsonUtil.snakeToCamelCase(rawRows[0]);

      const { name, phone, email, birthday, isUsed, isDeleted, updatedAt, createdAt } = row;

      return {
        id,
        name,
        phone,
        email,
        birthday,
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
    const runner = this.connection.createQueryRunner();
    try {
      const { name, email, phone, birthday, password } = req;

      await runner.startTransaction();
      // 전화번호를 unique 하게 저장하기 위해 아래와 같이 작성합니다. (for update 로 베타적 LOCK 활용)
      const resultOfGetUserByPhone = await runner.query(
        `
select * 
  from user 
 where phone = ?
   and is_used is true
   and is_deleted is false
   for update
      `,
        [phone],
      );
      this.logger.debug(`resultOfGetUserByPhone : ${resultOfGetUserByPhone}`);

      if (resultOfGetUserByPhone.length > 0) {
        const cancelMessage = `휴대폰 번호 중복 발생! 사용자 생성 취소`;
        this.logger.debug(cancelMessage);
        await runner.commitTransaction();
        return new ResponseWrapper<User>().fail().setMessage('phone duplicate error');
      }

      const hashPassword = await hash(password);

      const result: MySQLDMLResult = await runner.query(
        `
insert into user 
(name, phone, email, birthday, password) 
values (?, ?, ?, ?, ?) 
      `,
        [name, phone, email, birthday, hashPassword],
      );
      this.logger.debug(`사용자 생성 결과 : ${JSON.stringify(result)}`);

      const user = Object.assign(new User(), { name, phone, email, birthday });
      user.id = result.insertId;
      await runner.commitTransaction();

      return new ResponseWrapper<User>().setData(user);
    } catch (e) {
      this.logger.error(e.toString());
      await runner.rollbackTransaction();
      // TODO : 개발/운영 환경에 따른 에러로그 분리 (개발 환경에서는 더 상세한 정보를 내려주기)
      return new ResponseWrapper<User>().fail().setMessage('user create error');
    } finally {
      await runner.release();
    }
  }

  /**
   * 사용자 정보를 수정합니다.
   * @param id
   * @param req
   */
  async update(id: number, req: UpdateUserDto): Promise<ResponseWrapper<User>> {
    try {
      const { name, email, phone, birthday } = req;

      // TODO : 휴대폰 번호가 동일하게 입력되지 않도록 방지해야 합니다.

      const result: MySQLDMLResult = await this.connection.query(
        `
update user
   set name = ?,
       phone = ?,
       email = ?,
       birthday = ?
 where id = ?  
      `,
        [name, phone, email, birthday, id],
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

  /**
   * 사용자를 삭제합니다. (soft delete 처리)
   * @param id
   */
  async delete(id: number) {
    try {
      const result = await this.connection.query(
        `
update user
   set is_used = 0,
       is_deleted = 1
 where id = ?
      `,
        [id],
      );
      this.logger.debug(`사용자 정보 삭제 결과 : ${JSON.stringify(result)}`);

      const user = await this.getById(id);
      return new ResponseWrapper<User>().setData(user);
    } catch (e) {
      this.logger.error(e.toString());
      return new ResponseWrapper<User>().fail().setMessage('user delete error');
    }
  }

  /**
   * 사용자 정보를 수정(Patch) 합니다.
   * @param id
   * @param req
   */
  async patch(id: number, req: PatchUserDto) {
    try {
      if (Object.keys(req).length === 0) {
        this.logger.debug(`no patch data!!`);
        return new ResponseWrapper().fail().setMessage('no patch data!!');
      }

      const patchObject = this.makePatchObject(req);
      this.logger.debug(`patchObject: ${JSON.stringify(patchObject)}`);
      const result = await this.connection
        .createQueryBuilder()
        .update('user')
        .set(patchObject)
        .where('id = :id', { id })
        .execute();

      this.logger.debug(`patch result : ${JSON.stringify(result)}`);

      return new ResponseWrapper();
    } catch (e) {
      this.logger.error(e.toString());
      return new ResponseWrapper().fail();
    }
  }

  /**
   * patch 할 데이터 Object 를 생성합니다. (db 컬럼 : value)
   * @param req
   * @private
   */
  private makePatchObject(req: PatchUserDto) {
    const result = {};
    const { birthday, email, name, phone } = req;
    if (birthday) {
      result['birthday'] = birthday;
    }
    if (email) {
      result['email'] = email;
    }
    if (name) {
      result['name'] = name;
    }
    if (phone) {
      result['phone'] = phone;
    }
    return result;
  }

  /**
   * DB에 평문으로 저장되어 있는 password 에 bcrypt 를 적용하기 위한 임시 로직입니다.
   */
//   async applyBcryptToPasswords() {
//     const rawRows = await this.connection.query(`select id, password from user`);
//     for (const row of rawRows) {
//       const hashPassword = await hash(row.password);
//       await this.connection.query(
//         `
// update user
//    set password = ?
//  where id = ?`,
//         [hashPassword, row.id],
//       );
//     }
//   }
}
