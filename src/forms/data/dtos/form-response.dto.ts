import { ApiProperty } from '@nestjs/swagger';

export class FormResponseDto {
  @ApiProperty({
    description: 'ID único del formulario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la persona de contacto',
    example: 'Victor',
  })
  nombre: string;

  @ApiProperty({
    description: 'Apellidos de la persona de contacto',
    example: 'Perez Constantino',
  })
  apellidos: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '9637894562',
  })
  numeroTelefono: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'villalobos@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Calle de la dirección',
    example: 'Septima Oriente',
  })
  calle: string;

  @ApiProperty({
    description: 'Número exterior',
    example: '0',
  })
  numeroExterior: string;

  @ApiProperty({
    description: 'Código postal',
    example: '30040',
  })
  codigoPostal: string;

  @ApiProperty({
    description: 'Colonia',
    example: 'Centro',
  })
  colonia: string;

  @ApiProperty({
    description: 'Municipio',
    example: 'Tuxtla Gutierrez',
  })
  municipio: string;

  @ApiProperty({
    description: 'Estado',
    example: 'Chiapas',
  })
  estado: string;

  @ApiProperty({
    description: 'Comunidad a la que pertenece',
    example: 'San Juan Chamula',
    required: false,
  })
  comunidadPerteneciente: string;

  @ApiProperty({
    description: 'Razón por la que está interesado',
    example: 'Hola estoy interesado en la aplicación APRENDIA',
  })
  porQueMeInteresa: string;

  @ApiProperty({
    description: 'Indica si el formulario ha sido atendido',
    example: false,
  })
  atendido: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-01-21T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-21T10:30:00Z',
  })
  updatedAt: Date;
}
