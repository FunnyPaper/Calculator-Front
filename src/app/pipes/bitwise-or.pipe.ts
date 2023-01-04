import { Pipe, PipeTransform } from '@angular/core';

/**
 * Performs bitwise or operation
 */
@Pipe({
  name: 'bitwiseOr'
})
export class BitwiseOrPipe implements PipeTransform {

  transform(value: number, ...args: number[]): number {
    return args.reduce((p: number, c: number) => p | c, value);
  }
}
