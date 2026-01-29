export function isPath(key: string, value: unknown): value is string {
  return key === 'path' && typeof value === 'string';
}
