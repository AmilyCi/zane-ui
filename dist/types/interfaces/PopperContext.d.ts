import type { Instance } from '@popperjs/core';
import type { Measurable, RoleType } from '../types';
export interface PopperContext {
    addContentChangeListener(listener: () => void): void;
    addInstanceListener(listener: () => void): void;
    addReferenceListener(listener: () => void): void;
    addRoleChangeListener(listener: () => void): void;
    addTriggerChangeListener(listener: () => void): void;
    readonly content?: HTMLElement;
    readonly instance?: Instance;
    readonly reference?: Measurable;
    removeContentChangeListener(listener: () => void): void;
    removeInstanceChangeListener(listener: () => void): void;
    removeReferenceListener(listener: () => void): void;
    removeRoleChangeListener(listener: () => void): void;
    removeTriggerChangeListener(listener: () => void): void;
    readonly role: RoleType;
    readonly trigger?: Measurable;
    updateContent: (content: HTMLElement) => void;
    updateInstance: (instance: Instance) => void;
    updateReference: (reference: Measurable) => void;
    updateRole: (role: string) => void;
    updateTrigger: (trigger?: Measurable) => void;
}
