/**
 * Value Object para Código Postal
 * Encapsula la validación para códigos postales mexicanos (5 dígitos)
 */
export class PostalCode {
  private readonly value: string;

  constructor(postalCode: string) {
    this.validate(postalCode);
    this.value = postalCode.trim();
  }

  private validate(postalCode: string): void {
    if (!postalCode || postalCode.trim().length === 0) {
      throw new Error('El código postal no puede estar vacío');
    }

    const cleaned = postalCode.trim();

    // Validar que solo contenga dígitos
    if (!/^\d+$/.test(cleaned)) {
      throw new Error('El código postal solo puede contener dígitos');
    }

    // Validar longitud (5 dígitos para México)
    if (cleaned.length !== 5) {
      throw new Error('El código postal debe tener exactamente 5 dígitos');
    }

    // Validar que no inicie con 0
    if (cleaned.startsWith('0')) {
      throw new Error('El código postal no puede iniciar con 0');
    }
  }

  getValue(): string {
    return this.value;
  }

  /**
   * Verifica si el código postal pertenece a un rango específico
   */
  isInRange(min: number, max: number): boolean {
    const numericValue = parseInt(this.value, 10);
    return numericValue >= min && numericValue <= max;
  }

  equals(other: PostalCode): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
