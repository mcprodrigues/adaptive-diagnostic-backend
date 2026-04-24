export function isNonEmptyString(value: any): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isPositiveNumber(value: any): boolean {
  return typeof value === 'number' && value > 0;
}

export function isIntegerInRange(
  value: any,
  min: number,
  max: number,
): boolean {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}
