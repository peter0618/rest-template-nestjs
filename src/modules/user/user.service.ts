import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DBName } from '../database/database.model';
import { Connection } from 'typeorm';
import { User } from './model/user.model';
import { JsonUtil } from '../common/util/json.util';

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
}
