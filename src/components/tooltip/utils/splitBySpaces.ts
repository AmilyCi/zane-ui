export function splitBySpaces(value: string): string[] {
  return value.split(/\s+/).filter(Boolean);
}
