import { isString } from './is';

class ZaneJsError extends Error {
  constructor(m: string) {
    super(m);
    this.name = 'ZaneJsError';
  }
}

export function throwError(scope: string, m: string): never {
  throw new ZaneJsError(`[${scope}] ${m}`);
}

export function debugWarn(err: Error): void;
export function debugWarn(scope: string, message: string): void;
export function debugWarn(scope: Error | string, message?: string): void {
  const error: Error | string = isString(scope)
    ? new ZaneJsError(`[${scope}] ${message}`)
    : scope;

  console.warn(error);
}
