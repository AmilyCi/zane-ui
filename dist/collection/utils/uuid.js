const hexList = [];
for (let i = 0; i <= 15; i++) {
    hexList[i] = i.toString(16);
}
export function buildUUID() {
    let uuid = '';
    for (let i = 1; i <= 36; i++) {
        switch (i) {
            case 9:
            case 14:
            case 19:
            case 24: {
                uuid += '-';
                break;
            }
            case 15: {
                uuid += '4';
                break;
            }
            case 20: {
                uuid += hexList[(Math.random() * 4) | 8];
                break;
            }
            default: {
                uuid += hexList[Math.trunc(Math.random() * 16)];
            }
        }
    }
    return uuid;
}
