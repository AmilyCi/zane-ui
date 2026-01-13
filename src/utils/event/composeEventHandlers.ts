export const composeEventHandlers = <E>(
  theirsHandler?: (event: E) => boolean | undefined,
  oursHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) => {
  const handleEvent = (event: E) => {
    const shouldPrevent = theirsHandler?.(event);

    if (checkForDefaultPrevented === false || !shouldPrevent) {
      return oursHandler?.(event);
    }
  };
  return handleEvent;
};
