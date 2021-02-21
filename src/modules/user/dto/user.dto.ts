import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsOnlyDate } from '../../common/validator/IsOnlyDateValidator';

export class CreateUserDto {
  @ApiProperty({ description: '이름' })
  name: string;
  @ApiProperty({ description: '전화번호' })
  phone: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '비밀번호' })
  password: string;
  @IsOptional()
  @IsEmail()
  @ApiProperty({ description: '이메일', required: false })
  email?: string;
  @IsOptional()
  @IsOnlyDate()
  @ApiProperty({ description: '생일', required: false })
  birthday?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '이름', required: false })
  name?: string;
  @ApiProperty({ description: '전화번호', required: false })
  phone?: string;
  @IsOptional()
  @IsEmail()
  @ApiProperty({ description: '이메일', required: false })
  email?: string;
  @IsOnlyDate()
  @ApiProperty({ description: '생일', required: false })
  birthday?: string;
}

export class PatchUserDto {
  @IsOptional()
  @ApiProperty({ description: '이름', required: false })
  name?: string;

  @IsOptional()
  @ApiProperty({ description: '전화번호', required: false })
  phone?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ description: '이메일', required: false })
  email?: string;

  @IsOptional()
  @IsOnlyDate()
  @ApiProperty({ description: '생일', required: false })
  birthday?: string;
}
