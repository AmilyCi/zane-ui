export function darken(color, amount = 20) {
    return color.mix('#141414', amount).toString();
}
