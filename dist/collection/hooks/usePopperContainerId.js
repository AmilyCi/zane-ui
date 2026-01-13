import state from "../global/store";
import { useNamespace } from "./useNamespace";
export function usePopperContainerId() {
    const ns = useNamespace('popper');
    const id = `${ns.namespace}-popper-container-${state.idInjection.prefix}`;
    const selector = `#${id}`;
    return {
        id,
        selector,
    };
}
