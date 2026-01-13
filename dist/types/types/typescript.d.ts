export declare const mutable: <T extends readonly any[] | Record<string, unknown>>(val: T) => Mutable<typeof val>;
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
export type HTMLElementCustomized<T> = HTMLElement & T;
export type Nullable<T> = null | T;
export type Arrayable<T> = T | T[];
export type Awaitable<T> = Promise<T> | T;
type Primitive = bigint | boolean | null | number | string | symbol | undefined;
type BrowserNativeObject = Blob | Date | File | FileList | RegExp;
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;
type ArrayMethodKey = keyof any[];
type TupleKey<T extends ReadonlyArray<any>> = Exclude<keyof T, ArrayMethodKey>;
type ArrayKey = number;
type PathImpl<K extends number | string, V> = V extends BrowserNativeObject | Primitive ? `${K}` : `${K}.${Path<V>}` | `${K}`;
type Path<T> = T extends ReadonlyArray<infer V> ? IsTuple<T> extends true ? {
    [K in TupleKey<T>]-?: PathImpl<Exclude<K, symbol>, T[K]>;
}[TupleKey<T>] : PathImpl<ArrayKey, V> : {
    [K in keyof T]-?: PathImpl<Exclude<K, symbol>, T[K]>;
}[keyof T];
export type FieldPath<T> = T extends object ? Path<T> : never;
export type Measurable = {
    getBoundingClientRect: () => DOMRect;
};
/**
 * 任意类型的异步函数
 */
export type AnyPromiseFunction<T extends any[] = any[], R = void> = (...arg: T) => PromiseLike<R>;
/**
 * 任意类型的普通函数
 */
export type AnyNormalFunction<T extends any[] = any[], R = void> = (...arg: T) => R;
/**
 * 任意类型的函数
 */
export type AnyFunction<T extends any[] = any[], R = void> = AnyNormalFunction<T, R> | AnyPromiseFunction<T, R>;
export {};
