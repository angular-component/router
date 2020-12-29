import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function isNotNullable<T>(it: T): it is NonNullable<T> {
  return it !== null && it !== undefined;
}

export const filterNullable = <T>() => (source: Observable<T>) =>
  source.pipe(filter(isNotNullable));
