/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { defaultEquals, markSignal, Signal, ValueEqualityFn } from './api';
import {
  ConsumerId,
  Edge,
  nextReactiveId,
  Producer,
  producerAccessed,
  producerNotifyConsumers,
} from './internal';
import { WeakRef } from './weak_ref';

/**
 * A `Signal` with a value that can be mutated via a setter interface.
 *
 * @developerPreview
 */
export interface SettableSignal<T> extends Signal<T> {
  /**
   * Directly set the signal to a new value, and notify any dependents.
   */
  set(value: T): void;

  /**
   * Update the value of the signal based on its current value, and
   * notify any dependents.
   */
  update(updateFn: (value: T) => T): void;

  /**
   * Update the current value by mutating it in-place, and
   * notify any dependents.
   */
  mutate(mutatorFn: (value: T) => void): void;
}

/**
 * Backing type for a `SettableSignal`, a mutable reactive value.
 */
class SettableSignalImpl<T> implements Producer {
  constructor(private value: T, private equal: ValueEqualityFn<T>) {}

  readonly id = nextReactiveId();
  readonly ref = new WeakRef(this);
  readonly consumers = new Map<ConsumerId, Edge>();
  valueVersion = 0;

  checkForChangedValue(): void {
    // Settable signals can only change when set, so there's nothing to check here.
  }

  /**
   * Directly update the value of the signal to a new value, which may or may not be
   * equal to the previous.
   *
   * In the event that `newValue` is semantically equal to the current value, `set` is
   * a no-op.
   */
  set(newValue: T): void {
    if (!this.equal(this.value, newValue)) {
      this.value = newValue;
      this.valueVersion++;
      producerNotifyConsumers(this);
    }
  }

  /**
   * Derive a new value for the signal from its current value using the `updater` function.
   *
   * This is equivalent to calling `set` on the result of running `updater` on the current
   * value.
   */
  update(updater: (value: T) => T): void {
    this.set(updater(this.value));
  }

  /**
   * Calls `mutator` on the current value and assumes that it has been mutated.
   */
  mutate(mutator: (value: T) => void): void {
    // Note: mutate bypasses equality checks as it's by definition changing the value.
    mutator(this.value);
    this.valueVersion++;
    producerNotifyConsumers(this);
  }

  signal(): T {
    producerAccessed(this);
    return this.value;
  }
}

/**
 * Create a `Signal` that can be set or updated directly.
 *
 * @developerPreview
 */
export function signal<T>(
  initialValue: T,
  equal: ValueEqualityFn<T> = defaultEquals
): SettableSignal<T> {
  const sig = new SettableSignalImpl(initialValue, equal);
  const res = markSignal(sig.signal.bind(sig), {
    set: sig.set.bind(sig),
    update: sig.update.bind(sig),
    mutate: sig.mutate.bind(sig),
  });
  //@ts-ignore // I added this tsignore as it wasn't compiling
  return res;
}
