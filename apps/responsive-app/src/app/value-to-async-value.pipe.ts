import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Pipe({
  name: 'valueToAsyncValue',
})
export class ValueToAsyncValuePipe implements PipeTransform {
  transform(value: string): Observable<string> {
    return of(value).pipe(delay(10));
  }
}
