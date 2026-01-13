import { isClient } from "./isClient";
export const isFirefox = () => isClient && /firefox/i.test(window.navigator.userAgent);
