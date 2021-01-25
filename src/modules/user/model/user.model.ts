import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ description: '아이디' })
  id: number;
  @ApiProperty({ description: '이름' })
  name: string;
  @ApiProperty({ description: '전화번호' })
  phone: string;
  @ApiProperty({ description: '이메일' })
  email: string;
  @ApiProperty({ description: '사용여부' })
  isUsed: boolean;
  @ApiProperty({ description: '삭제여부' })
  isDeleted: boolean;
  @ApiProperty({ description: '수정일시' })
  updatedAt: string;
  @ApiProperty({ description: '생성일시' })
  createdAt: string;
}
