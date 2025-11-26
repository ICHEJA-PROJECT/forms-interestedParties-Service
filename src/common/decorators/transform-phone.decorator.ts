import { Transform } from 'class-transformer';
import { PhoneNumber } from '../../forms/domain/value-objects/phone-number.vo';

/**
 * Decorador para transformar string a Value Object PhoneNumber
 * Normaliza automáticamente el formato (+52)
 */
export function TransformPhone() {
  return Transform(({ value }) => {
    if (!value) return value;
    try {
      const phoneVO = new PhoneNumber(value);
      return phoneVO.getValue();
    } catch (error) {
      return value;
    }
  });
}
