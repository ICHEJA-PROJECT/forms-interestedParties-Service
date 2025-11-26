import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: ['admin'] })
  roles: string[];
}
