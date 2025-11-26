import { ApiProperty } from '@nestjs/swagger';

export class StatsResponseDto {
  @ApiProperty({
    description: 'Total de registros',
    example: 150,
  })
  totalRegistros: number;

  @ApiProperty({
    description: 'Registros atendidos',
    example: 45,
  })
  registrosAtendidos: number;

  @ApiProperty({
    description: 'Registros no atendidos',
    example: 105,
  })
  registrosNoAtendidos: number;
}
