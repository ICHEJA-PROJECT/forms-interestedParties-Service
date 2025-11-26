import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para actualizar el estado de atendido de un formulario
 */
export class UpdateAtendidoDto {
  @ApiProperty({
    description: 'Estado de atención del formulario',
    example: true,
  })
  @IsBoolean({ message: 'El campo atendido debe ser un booleano' })
  @IsNotEmpty()
  atendido: boolean;
}
