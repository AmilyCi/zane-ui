import { isClient } from "./isClient";
export const isAndroid = () => isClient && /android/i.test(window.navigator.userAgent);
