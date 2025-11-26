import { ApiProperty } from '@nestjs/swagger';

export class TopStateDto {
  @ApiProperty({
    description: 'Nombre del estado',
    example: 'Chiapas',
  })
  estado: string;

  @ApiProperty({
    description: 'Total de registros',
    example: 150,
  })
  totalRegistros: number;
}
