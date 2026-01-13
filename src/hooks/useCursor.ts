interface SelectionInfo {
  afterTxt?: string;
  beforeTxt?: string;
  selectionEnd?: number;
  selectionStart?: number;
  value?: string;
}

// Keep input cursor in the correct position when we use formatter.
export function useCursor(
  input: HTMLInputElement | undefined,
): [() => void, () => void] {
  let selectionInfo: SelectionInfo;

  function recordCursor() {
    if (input === undefined) return;

    const { selectionEnd, selectionStart, value } = input;

    if (selectionStart === null || selectionEnd === null) return;

    const beforeTxt = value.slice(0, Math.max(0, selectionStart));
    const afterTxt = value.slice(Math.max(0, selectionEnd));

    selectionInfo = {
      afterTxt,
      beforeTxt,
      selectionEnd,
      selectionStart,
      value,
    };
  }

  function setCursor() {
    if (input === undefined || selectionInfo === undefined) return;

    const { value } = input;
    const { afterTxt, beforeTxt, selectionStart } = selectionInfo;

    if (
      beforeTxt === undefined ||
      afterTxt === undefined ||
      selectionStart === undefined
    )
      return;

    let startPos = value.length;

    if (value.endsWith(afterTxt)) {
      startPos = value.length - afterTxt.length;
    } else if (value.startsWith(beforeTxt)) {
      startPos = beforeTxt.length;
    } else {
      const beforeLastChar = beforeTxt[selectionStart - 1];
      const newIndex = value.indexOf(beforeLastChar, selectionStart - 1);
      if (newIndex !== -1) {
        startPos = newIndex + 1;
      }
    }

    input.setSelectionRange(startPos, startPos);
  }

  return [recordCursor, setCursor];
}
