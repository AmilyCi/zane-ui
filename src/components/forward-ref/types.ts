export type ForwardRefSetter<T = any> = (el: T) => void;

export type ForwardRefContext = {
  setForwardRef: ForwardRefSetter;
}
