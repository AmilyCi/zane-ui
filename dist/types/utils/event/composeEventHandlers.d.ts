export declare const composeEventHandlers: <E>(theirsHandler?: (event: E) => boolean | undefined, oursHandler?: (event: E) => void, { checkForDefaultPrevented }?: {
    checkForDefaultPrevented?: boolean;
}) => (event: E) => void;
