import { IsString, IsEmail, IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFormDto {
  @ApiProperty({
    description: 'Nombre de la persona de contacto',
    example: 'Victor',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    description: 'Apellidos de la persona de contacto',
    example: 'Perez Constantino',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellidos: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '9637894562',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, { message: 'El número de teléfono debe contener solo dígitos' })
  @MinLength(10)
  @MaxLength(20)
  numeroTelefono: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'villalobos@gmail.com',
    maxLength: 150,
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    description: 'Calle de la dirección',
    example: 'Septima Oriente',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  calle: string;

  @ApiProperty({
    description: 'Número exterior',
    example: '0',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  numeroExterior: string;

  @ApiProperty({
    description: 'Código postal',
    example: '30040',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, { message: 'El código postal debe contener solo dígitos' })
  @MaxLength(10)
  codigoPostal: string;

  @ApiProperty({
    description: 'Colonia',
    example: 'Centro',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  colonia: string;

  @ApiProperty({
    description: 'Municipio',
    example: 'Tuxtla Gutierrez',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  municipio: string;

  @ApiProperty({
    description: 'Estado',
    example: 'Chiapas',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  estado: string;

  @ApiProperty({
    description: 'Comunidad a la que pertenece',
    example: 'San Juan Chamula',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  comunidadPerteneciente: string;

  @ApiProperty({
    description: 'Razón por la que está interesado en APRENDIA',
    example: 'Hola estoy interesado en la aplicación APRENDIA y quisiera que me contacten para recibir más información.',
  })
  @IsString()
  @IsNotEmpty()
  porQueMeInteresa: string;
}
