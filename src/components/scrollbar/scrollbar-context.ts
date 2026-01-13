import { ScrollbarContext as IScrollbarContext } from '../../interfaces';

export class ScrollbarContext implements IScrollbarContext {
  scrollbarElement: HTMLElement;
  wrapElement: HTMLDivElement;
}
