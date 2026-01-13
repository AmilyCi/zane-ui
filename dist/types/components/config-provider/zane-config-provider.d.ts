import type { ButtonConfigContext, CardConfigContext } from '../../interfaces';
import type { Language } from '../../locale';
export declare class ZaneConfigProvider {
    button: ButtonConfigContext;
    card: CardConfigContext;
    el: HTMLElement;
    locale: Language;
    zIndex: number;
    render(): any;
}
