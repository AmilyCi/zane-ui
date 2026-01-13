export function removeUndefinedProps(
  obj: Record<string, unknown>,
): Partial<Record<string, unknown>> {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) {
      (acc as any)[key] = obj[key];
    }

    return acc;
  }, {});
}
