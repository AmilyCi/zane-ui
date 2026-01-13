import { dangerouslySetInnerHTML, isElement } from "../../../utils";
export function setContent(content, props) {
    if (isElement(props.content)) {
        dangerouslySetInnerHTML(content, '');
        content.append(props.content);
    }
    else if (typeof props.content !== 'function') {
        if (props.allowHTML) {
            dangerouslySetInnerHTML(content, props.content);
        }
        else {
            content.textContent = props.content;
        }
    }
}
