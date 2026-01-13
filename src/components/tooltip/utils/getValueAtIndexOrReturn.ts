export function getValueAtIndexOrReturn<T>(
  value: [null | T, null | T] | T,
  index: number,
  defaultValue: [T, T] | T,
): T {
  if (Array.isArray(value)) {
    const v = value[index];
    return v === null
      ? // eslint-disable-next-line unicorn/no-nested-ternary
        Array.isArray(defaultValue)
        ? defaultValue[index]
        : defaultValue
      : v;
  }

  return value;
}
