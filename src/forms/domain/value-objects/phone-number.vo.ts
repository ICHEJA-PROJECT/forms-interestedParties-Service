/**
 * Value Object para Número de Teléfono
 * Encapsula la validación para números telefónicos mexicanos
 */
export class PhoneNumber {
  private readonly value: string;

  constructor(phoneNumber: string) {
    this.validate(phoneNumber);
    this.value = this.normalize(phoneNumber);
  }

  private validate(phoneNumber: string): void {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      throw new Error('El número de teléfono no puede estar vacío');
    }

    // Eliminar espacios, guiones y paréntesis para validar
    const cleaned = phoneNumber.replace(/[\s\-()]/g, '');

    // Validar que solo contenga dígitos y posiblemente un + al inicio
    if (!/^\+?\d+$/.test(cleaned)) {
      throw new Error('El número de teléfono solo puede contener dígitos');
    }

    // Validar longitud (10 dígitos para México, o 12 con +52)
    if (cleaned.length !== 10 && cleaned.length !== 12 && cleaned.length !== 13) {
      throw new Error('El número de teléfono debe tener 10 dígitos');
    }
  }

  private normalize(phoneNumber: string): string {
    // Eliminar espacios, guiones y paréntesis
    let cleaned = phoneNumber.replace(/[\s\-()]/g, '');

    // Si tiene +52, lo mantenemos
    if (cleaned.startsWith('+52')) {
      return cleaned;
    }

    // Si tiene 52 al inicio sin +, agregamos el +
    if (cleaned.startsWith('52') && cleaned.length === 12) {
      return '+' + cleaned;
    }

    // Si son solo 10 dígitos, agregamos +52
    if (cleaned.length === 10) {
      return '+52' + cleaned;
    }

    return cleaned;
  }

  getValue(): string {
    return this.value;
  }

  /**
   * Retorna el número en formato legible: +52 (xxx) xxx-xxxx
   */
  getFormatted(): string {
    const digits = this.value.replace('+52', '');
    if (digits.length === 10) {
      return `+52 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
