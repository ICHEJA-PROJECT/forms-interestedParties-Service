import { Transform } from 'class-transformer';
import { Email } from '../../forms/domain/value-objects/email.vo';

/**
 * Decorador para transformar string a Value Object Email
 * Aplica validación automática del Value Object
 */
export function TransformEmail() {
  return Transform(({ value }) => {
    if (!value) return value;
    try {
      const emailVO = new Email(value);
      return emailVO.getValue();
    } catch (error) {
      // Si falla la validación del VO, devolvemos el valor original
      // para que class-validator pueda manejarlo
      return value;
    }
  });
}
