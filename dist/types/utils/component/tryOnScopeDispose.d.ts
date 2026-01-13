import { ComponentInterface } from '../../stencil-public-runtime';
type CleanupFunction = () => void;
/**
 * 尝试在组件的销毁回调中注册清理函数。
 *
 * @param {ComponentInterface} component - 要操作的组件对象。
 * @param {CleanupFunction} fn - 需要在组件销毁时执行的清理函数。
 * @returns {boolean} 如果成功注册清理函数返回true，否则返回false。
 */
export declare function tryOnScopeDispose(component: ComponentInterface, fn: CleanupFunction): boolean;
export {};
