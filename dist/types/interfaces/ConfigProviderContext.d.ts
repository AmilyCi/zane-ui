import type { Language } from '../locale';
import type { ButtonConfigContext } from './ButtonConfigContext';
import type { CardConfigContext } from './CardConfigContext';
export interface ConfigProviderContext {
    button: ButtonConfigContext;
    card: CardConfigContext;
    locale: Language;
}
