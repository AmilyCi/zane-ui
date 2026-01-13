import { defaultProps } from "../constants";
import { getDataAttributeProps } from "./getDataAttributeProps";
import { invokeWithArgsOrReturn } from "./invokeWithArgsOrReturn";
export function evaluateProps(reference, props) {
    const out = Object.assign(Object.assign(Object.assign({}, props), { content: invokeWithArgsOrReturn(props.content, [reference]) }), (props.ignoreAttributes
        ? {}
        : getDataAttributeProps(reference, props.plugins)));
    out.aria = Object.assign(Object.assign({}, defaultProps.aria), out.aria);
    out.aria = {
        content: out.aria.content === 'auto'
            ? // eslint-disable-next-line unicorn/no-nested-ternary
                props.interactive
                    ? null
                    : 'describedby'
            : out.aria.content,
        expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
    };
    return out;
}
