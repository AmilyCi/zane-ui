import { isFirefox } from '../../is/isFirefox';
import { isNumber } from '../../is/isNumber';

type TextAreaHeight = {
  height: string;
  minHeight?: string;
};

type NodeStyle = {
  borderSize: number;
  boxSizing: string;
  contextStyle: string[][];
  paddingSize: number;
};

const HIDDEN_STYLE = {
  height: '0',
  overflow: isFirefox() ? '' : 'hidden',
  position: 'absolute',
  right: '0',
  top: '0',
  visibility: 'hidden',
  'z-index': '-1000',
};

const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing',
  'word-break',
];

let hiddenTextarea: HTMLTextAreaElement | undefined;

function calculateNodeStyling(targetElement: Element): NodeStyle {
  const style = window.getComputedStyle(targetElement);

  const boxSizing = style.getPropertyValue('box-sizing');

  const paddingSize =
    Number.parseFloat(style.getPropertyValue('padding-bottom')) +
    Number.parseFloat(style.getPropertyValue('padding-top'));

  const borderSize =
    Number.parseFloat(style.getPropertyValue('border-bottom-width')) +
    Number.parseFloat(style.getPropertyValue('border-top-width'));

  const contextStyle = CONTEXT_STYLE.map((name) => [
    name,
    style.getPropertyValue(name),
  ]);

  return { borderSize, boxSizing, contextStyle, paddingSize };
}

export function calcTextareaHeight(
  targetElement: HTMLTextAreaElement,
  minRows = 1,
  maxRows?: number,
): TextAreaHeight {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    (targetElement.parentNode ?? document.body).append(hiddenTextarea);
  }

  const { borderSize, boxSizing, contextStyle, paddingSize } =
    calculateNodeStyling(targetElement);

  contextStyle.forEach(([key, value]) =>
    hiddenTextarea?.style.setProperty(key, value),
  );

  Object.entries(HIDDEN_STYLE).forEach(([key, value]) =>
    hiddenTextarea?.style.setProperty(key, value, 'important'),
  );

  hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';

  let height = hiddenTextarea.scrollHeight;
  const result = {} as TextAreaHeight;

  if (boxSizing === 'border-box') {
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize;
  }

  hiddenTextarea.value = '';
  const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

  if (isNumber(minRows)) {
    let minHeight = singleRowHeight * minRows;
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize;
    }
    height = Math.max(minHeight, height);
    result.minHeight = `${minHeight}px`;
  }
  if (isNumber(maxRows)) {
    let maxHeight = singleRowHeight * maxRows;
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize;
    }
    height = Math.min(maxHeight, height);
  }
  result.height = `${height}px`;
  hiddenTextarea.remove();
  hiddenTextarea = undefined;

  return result;
}
