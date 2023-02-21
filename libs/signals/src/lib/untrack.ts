/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 import {setActiveConsumer} from './internal';

 /**
  * Execute an arbitrary function in a non-reactive (non-tracking) context. The executed function
  * can, optionally, return a value.
  *
  * @developerPreview
  */
 export function untrack<T>(nonReactiveReadsFn: () => T): T {
   const prevConsumer = setActiveConsumer(null);
   try {
     return nonReactiveReadsFn();
   } finally {
     setActiveConsumer(prevConsumer);
   }
 }
 