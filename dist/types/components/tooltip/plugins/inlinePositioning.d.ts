import { BasePlacement, InlinePositioning } from '../types';
declare const inlinePositioning: InlinePositioning;
export default inlinePositioning;
export declare function getInlineBoundingClientRect(currentBasePlacement: BasePlacement | null, boundingRect: DOMRect, clientRects: DOMRect[], cursorRectIndex: number): {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
};
