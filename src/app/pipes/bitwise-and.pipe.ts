import { Pipe, PipeTransform } from '@angular/core';

/**
 * Performs bitwise and operation
 */
@Pipe({
  name: 'bitwiseAnd'
})
export class BitwiseAndPipe implements PipeTransform {

  transform(value: number, ...args: number[]): number {
    return args.reduce((p: number, c: number) => p & c, value);
  }

}
