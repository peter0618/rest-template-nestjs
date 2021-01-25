import { ApiProperty } from '@nestjs/swagger';

/**
 * REST API 에서 응답할 때 사용할 기본 포맷을 작성했습니다.
 * 기본적으로 API 요청 처리 성공 여부(success), 조회 데이터(data), 에러메시지(message), 에러메시지코드(code)를 리턴합니다.
 * TODO : 에러메시지 코드에 대한 상세 정의가 필요합니다.
 */

export class ResponseWrapper<T> {
  @ApiProperty({ description: '성공여부' })
  private success = true;

  @ApiProperty({ description: '데이터', required: false })
  private data?: T;

  @ApiProperty({ description: '메시지', required: false })
  private message?: string;

  @ApiProperty({ description: '응답코드', required: false })
  private code?: string;

  public fail(): ResponseWrapper<T> {
    this.success = false;
    return this;
  }

  public setData(data: T): ResponseWrapper<T> {
    this.data = data;
    return this;
  }

  public setMessage(message: string): ResponseWrapper<T> {
    this.message = message;
    return this;
  }

  public setCode(code: string): ResponseWrapper<T> {
    this.code = code;
    return this;
  }
}
