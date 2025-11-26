import { Transform } from 'class-transformer';
import { PostalCode } from '../../forms/domain/value-objects/postal-code.vo';

/**
 * Decorador para transformar string a Value Object PostalCode
 * Valida formato de código postal mexicano (5 dígitos)
 */
export function TransformPostalCode() {
  return Transform(({ value }) => {
    if (!value) return value;
    try {
      const postalCodeVO = new PostalCode(value);
      return postalCodeVO.getValue();
    } catch (error) {
      return value;
    }
  });
}
