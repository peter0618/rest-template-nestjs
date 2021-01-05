/**
 * MySQL 에서 insert 시 반환해주는 값입니다.
 */
export interface MySQLDMLResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

/**
 * 각각의 MySQL DB Connection 에 대한 별칭입니다.
 */
export enum DBName {
  TEST_DB = 'test_db',
}
