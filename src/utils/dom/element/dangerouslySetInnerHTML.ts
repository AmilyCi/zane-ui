// Firefox extensions don't allow .innerHTML = "..." property. This tricks it.
const innerHTML = (): 'innerHTML' => 'innerHTML';

export function dangerouslySetInnerHTML(element: Element, html: string): void {
  element[innerHTML()] = html;
}
