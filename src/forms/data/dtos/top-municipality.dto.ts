import { ApiProperty } from '@nestjs/swagger';

export class TopMunicipalityDto {
  @ApiProperty({
    description: 'Nombre del municipio',
    example: 'Tuxtla Gutierrez',
  })
  municipio: string;

  @ApiProperty({
    description: 'Total de registros',
    example: 35,
  })
  totalRegistros: number;
}
