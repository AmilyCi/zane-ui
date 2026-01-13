export declare const useFocusReason: () => {
    connect: () => void;
    disconnect: () => void;
    getFocusReason: () => "keyboard" | "pointer";
    getLastAutomatedFocusTimestamp: () => number;
    getLastUserFocusTimestamp: () => number;
    isFocusCausedByUserEvent: () => boolean;
    tryFocus: (element?: HTMLElement | null | {
        focus: () => void;
    }, shouldSelect?: boolean) => void;
};
