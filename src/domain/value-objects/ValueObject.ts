/**
 * Base class for Value Objects
 * Value Objects are immutable and compared by their values, not identity
 */
export abstract class ValueObject<T> {
  protected readonly _value: T;

  protected constructor(value: T) {
    this._value = value;
  }

  public get value(): T {
    return this._value;
  }

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other.constructor.name !== this.constructor.name) {
      return false;
    }
    return this.isEqual(other._value);
  }

  protected abstract isEqual(value: T): boolean;

  public toString(): string {
    return String(this._value);
  }
}
