/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Symbol used to tell `Signal`s apart from other functions.
 */
 const SIGNAL = Symbol('SIGNAL');

 /**
  * A reactive value which notifies consumers of any changes.
  *
  * Signals are functions which returns their current value. To access the current value of a signal,
  * call it.
  *
  * Ordinary values can be turned into `Signal`s with the `signal` function.
  *
  * @developerPreview
  */
 export type Signal<T> = (() => T)&{
   [SIGNAL]: true;
 };
 
 /**
  * Checks if the given `value` function is a reactive `Signal`.
  */
 export function isSignal(value: Function): value is Signal<unknown> {
   return (value as Signal<unknown>)[SIGNAL] ?? false;
 }
 
 /**
  * Marks `fn` such that `isSignal(fn)` will be `true`.
  */
 export function markSignal<T>(fn: () => T): Signal<T>;
 export function markSignal<T, U extends {}>(fn: () => T, extraApi: U): Signal<T>&U;
 export function markSignal<T, U extends {} = {}>(fn: () => T, extraApi: U = ({} as U)): Signal<T>&
     U {
   (fn as any)[SIGNAL] = true;
   for (const key in extraApi) {
     (fn as any)[key] = extraApi[key];
   }
   return fn as (Signal<T>& U);
 }
 
 /**
  * A comparison function which can determine if two values are equal.
  *
  * @developerPreview
  */
 export type ValueEqualityFn<T> = (a: T, b: T) => boolean;
 
 /**
  * The default equality function used for `signal` and `computed`, which treats objects
  * and arrays as never equal, and all other primitive values using identity semantics.
  *
  * @developerPreview
  */
 export function defaultEquals<T>(a: T, b: T) {
   if (Object.is(a, b)) {
     return a !== null && typeof a === 'object' ? false : true;
   }
   return false;
 }
 