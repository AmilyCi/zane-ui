export const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
    const handleEvent = (event) => {
        const shouldPrevent = theirsHandler === null || theirsHandler === void 0 ? void 0 : theirsHandler(event);
        if (checkForDefaultPrevented === false || !shouldPrevent) {
            return oursHandler === null || oursHandler === void 0 ? void 0 : oursHandler(event);
        }
    };
    return handleEvent;
};
