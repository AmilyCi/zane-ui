import type { Props } from '../types';

import { dangerouslySetInnerHTML, isElement } from '../../../utils';

export function setContent(content: HTMLDivElement, props: Props): void {
  if (isElement(props.content)) {
    dangerouslySetInnerHTML(content, '');
    content.append(props.content);
  } else if (typeof props.content !== 'function') {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
