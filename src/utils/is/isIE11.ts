import { isBrowser } from './isBrowser';

export const isIE11 = (): boolean =>
  isBrowser() ? !!(window as any)?.msCrypto : false;
