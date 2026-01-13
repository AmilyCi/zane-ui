export function invokeWithArgsOrReturn(value: any, args: any[]): any {
  return typeof value === 'function' ? value(...args) : value;
}
