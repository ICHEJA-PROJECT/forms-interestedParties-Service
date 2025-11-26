import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterFormsDto {
  @ApiPropertyOptional({
    description: 'Filtrar por colonia',
    example: 'Centro',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Colonia no puede estar vacía si se proporciona' })
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  colonia?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por municipio',
    example: 'Tuxtla Gutierrez',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Municipio no puede estar vacío si se proporciona' })
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  municipio?: string;
}
