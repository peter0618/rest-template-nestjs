import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '이름' })
  name: string;
  @ApiProperty({ description: '전화번호' })
  phone: string;
  @ApiProperty({ description: '이메일', required: false })
  email?: string;
  @ApiProperty({ description: '생일', required: false })
  birthday?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '이름', required: false })
  name?: string;
  @ApiProperty({ description: '전화번호', required: false })
  phone?: string;
  @ApiProperty({ description: '이메일', required: false })
  email?: string;
  @ApiProperty({ description: '생일', required: false })
  birthday?: string;
}
