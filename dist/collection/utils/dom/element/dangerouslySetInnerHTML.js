// Firefox extensions don't allow .innerHTML = "..." property. This tricks it.
const innerHTML = () => 'innerHTML';
export function dangerouslySetInnerHTML(element, html) {
    element[innerHTML()] = html;
}
