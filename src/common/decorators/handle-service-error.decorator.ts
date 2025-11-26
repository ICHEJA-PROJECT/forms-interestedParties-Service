import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

/**
 * Decorador para manejo automático de errores en servicios
 * Elimina la necesidad de escribir try-catch en cada método
 *
 * @param defaultMessage - Mensaje de error por defecto si no viene en la excepción
 *
 * @example
 * ```typescript
 * @HandleServiceError('Error al crear formulario')
 * async create(dto: CreateFormDto): Promise<FormResponseDto> {
 *   const form = await this.repository.create(dto);
 *   return this.mapper.toResponseDto(form);
 * }
 * ```
 */
export function HandleServiceError(defaultMessage: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        throw new RpcException({
          message: error.message || defaultMessage,
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    };

    return descriptor;
  };
}
