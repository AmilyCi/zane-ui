import type { Props } from '../types';

import { dangerouslySetInnerHTML, div, isElement } from '../../../utils';
import { ARROW_CLASS, SVG_ARROW_CLASS } from '../constants';

export function createArrowElement(value: Props['arrow']): HTMLDivElement {
  const arrow = div();

  if (value === true) {
    arrow.className = ARROW_CLASS;
  } else {
    arrow.className = SVG_ARROW_CLASS;

    if (isElement(value)) {
      arrow.append(value);
    } else {
      dangerouslySetInnerHTML(arrow, value as string);
    }
  }

  return arrow;
}
