import { Subject } from 'rxjs';

/**
 * ReactiveObject 类用于创建响应式对象，能够监听对象属性的变化, 不会触发嵌套对象的深度监听
 * @template T - 原始对象的类型，必须是一个对象类型
 * @class ReactiveObject
 * @example
 * const obj = new ReactiveObject({ name: 'John', age: 25 });
 * obj.change$.subscribe(change => {
 *   console.log(`属性 ${change.key} 从 ${change.oldValue} 变为 ${change.value}`);
 * });
 * obj.value.name = 'Jane'; // 触发监听事件
 */
export class ReactiveObject<T extends object> {
  /** 
   * Subject 用于发射对象属性变化的事件
   * @private
   * @type {Subject<{ key: keyof T; value: any; oldValue: any }>}
   */
  private subject = new Subject<{ key: keyof T; value: any; oldValue: any }>();
  
  /**
   * 代理对象，用于拦截对原始对象的操作
   * @private
   * @type {T}
   */
  private proxy: T;
  
  /**
   * 可观察的流，用于外部订阅对象属性的变化
   * @public
   * @type {Observable<{ key: keyof T; value: any; oldValue: any }>}
   */
  public change$ = this.subject.asObservable();
  
  /**
   * 创建 ReactiveObject 实例
   * @constructor
   * @param {T} obj - 要转换为响应式对象的原始对象
   * @example
   * const reactiveObj = new ReactiveObject({ name: 'Alice', age: 30 });
   */
  constructor(obj: T) {
    // 创建 Proxy 对象来拦截对原始对象的 set 操作
    this.proxy = new Proxy(obj, {
      /**
       * Proxy 的 set 拦截器，当设置对象属性时触发
       * @param {T} target - 目标对象（原始对象）
       * @param {string | symbol} property - 要设置的属性名
       * @param {any} value - 要设置的新值
       * @returns {boolean} - 返回 true 表示设置成功
       */
      set: (target, property, value) => {
        // 获取属性的旧值
        const oldValue = target[property as keyof T];
        // 设置属性的新值
        target[property as keyof T] = value;
        
        // 只有值确实发生变化时才发射事件
        // 注意：这里使用严格相等比较，对于对象引用变化会触发，但对象内容变化不会触发
        if (oldValue !== value) {
          // 发射属性变化事件，包含属性名、新值和旧值
          this.subject.next({ 
            key: property as keyof T, 
            value, 
            oldValue 
          });
        }
        // 返回 true 表示设置成功
        return true;
      }
    });
  }
  
  /**
   * 获取代理对象，通过此对象访问和修改属性会触发监听
   * @getter
   * @returns {T} - 返回代理对象
   * @example
   * const obj = new ReactiveObject({ name: 'Bob' });
   * obj.value.name = 'Charlie'; // 修改属性会触发监听
   * console.log(obj.value.name); // 访问属性
   */
  get value(): T {
    return this.proxy;
  }
}
