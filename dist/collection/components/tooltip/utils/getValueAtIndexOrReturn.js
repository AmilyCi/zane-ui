export function getValueAtIndexOrReturn(value, index, defaultValue) {
    if (Array.isArray(value)) {
        const v = value[index];
        return v === null
            ? // eslint-disable-next-line unicorn/no-nested-ternary
                Array.isArray(defaultValue)
                    ? defaultValue[index]
                    : defaultValue
            : v;
    }
    return value;
}
