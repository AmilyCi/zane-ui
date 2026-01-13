export function pushIfUnique<T>(arr: T[], value: T): void {
  if (!arr.includes(value)) {
    arr.push(value);
  }
}
