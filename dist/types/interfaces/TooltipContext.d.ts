import type { Arrayable, TooltipTriggerType } from '../types';
export interface TooltipContext {
    controlled: boolean;
    id: string;
    onBeforeHide: () => void;
    onBeforeShow: () => void;
    onClose: (e?: Event) => void;
    onHide: () => void;
    onOpen: (e?: Event) => void;
    onShow: () => void;
    onToggle: (e: Event) => void;
    open: boolean;
    trigger: Arrayable<TooltipTriggerType>;
    updatePopper: () => void;
}
