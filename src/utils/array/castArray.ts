export function castArray(...args: any[]) {
  if (!args.length) {
    return [];
  }
  const value = args[0];
  return Array.isArray(value) ? value : [value];
}
