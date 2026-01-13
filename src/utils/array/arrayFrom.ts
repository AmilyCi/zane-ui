export function arrayFrom<T extends object>(value: ArrayLike<T>): T[] {
  return Array.prototype.slice.call(value);
}
