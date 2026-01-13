import { isBrowser } from "./isBrowser";
export const isIE11 = () => isBrowser() ? !!(window === null || window === void 0 ? void 0 : window.msCrypto) : false;
