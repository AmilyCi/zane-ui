export function isType(value: any, type: string): boolean {
  const str = Object.prototype.toString.call(value);
  return str.indexOf('[object') === 0 && str.includes(`${type}]`);
}
