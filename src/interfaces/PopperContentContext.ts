export interface PopperContentContext {
  arrowRef?: HTMLElement;
  arrowStyle?: Record<string, string>;
  arrowStyleUpdateCallback: (() => void)[];
}
