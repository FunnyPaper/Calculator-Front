import {
  IExpressionOptions,
  IExpressionData,
} from './../interfaces/expression-data.interface';
import { ButtonGroup, NextGroup } from '../enums/button-group.enum';
import TokenData from './token-data.model';

/**
 * Pseudo stack with parser capabilities
 */
export class ExpressionStack {
  private __stack: TokenData[];
  private __valid: boolean = true;
  private __options: IExpressionOptions;
  private __functions: Map<string, { min: number; max: number }>;

  /**
   * Get stored options
   *
   * @readonly
   * @type {IExpressionOptions}
   * @memberof ExpressionStack
   */
  get Options(): IExpressionOptions {
    return this.__options;
  }

  /**
   * Set provided options
   *
   * @param options object with calculations options
   */
  set Options(options: IExpressionOptions) {
    this.__options = { ...this.__options, ...options };
  }

  /**
   * Get valid expression joined in single string
   *
   * @readonly
   * @type {string}
   * @memberof ExpressionStack
   * @throws error if expression can't be terminated with EQUALS token
   */
  get Expression(): IExpressionData {
    return {
      expression: this.__stack.map((e) => e.value).join('') || '0',
      options: this.__options,
    };
  }

  get isValid(): boolean {
    return this.__valid;
  }

  get Stack(): TokenData[] {
    return this.__stack;
  }

  constructor() {
    this.__stack = [];
    this.__options = { rad: false };
    this.__functions = new Map();
  }

  /**
   * Appends buttons to expression
   *
   * @param button pressed button
   */
  append(...buttons: TokenData[]): void {
    if ((buttons[0]?.group ?? ButtonGroup.NONE) & this.nextValidGroups()) {
      this.__stack.push(...buttons);
    }
  }

  /**
   * Pops symbol from expression
   *
   * @param button pressed button
   */
  pop(): void {
    this.__stack.pop();
  }

  /**
   * Clears expression
   *
   * @param button pressed button
   */
  clear(): void {
    this.__stack.splice(0, this.__stack.length);
  }

  /**
   * Registers function arguments data
   *
   * @param param0 args params can be skipped (all functions default to one argument only)
   */
  registerFunction({
    key,
    args = { min: 1, max: 1 },
  }: {
    key: string;
    args?: { min?: number; max?: number };
  }): void {
    this.__functions.set(key, { min: args.min ?? 1, max: args.max ?? 1 });
  }

  /**
   * Deletes function data from registry
   *
   * @param functionKey
   */
  unregisterFunction(functionKey: string): void {
    this.__functions.delete(functionKey);
  }

  /**
   * Performs two checks (function separators + body and balanced parentheses).
   * This data is always related to each other.
   *
   * @returns object literal with boolean values for whenever separator and close bracket can be appended
   */
  private checkArgs(): { separator: boolean; close_bracket: boolean } {
    // Check for open brackets count
    const counts: { open: number; close: number } = this.__stack.reduce(
      (p, c) => {
        if (c.group & ButtonGroup.OPEN_BRACKET) {
          p.open++;
        } else if (c.group & ButtonGroup.CLOSE_BRACKET) {
          p.close++;
        }
        return p;
      },
      { open: 0, close: 0 }
    );

    // Check args count
    let separators = 0;
    let i = this.__stack.length - 1;
    for (let depth = 1; i >= 0 && depth > 0; i--) {
      if (this.__stack[i].group & ButtonGroup.CLOSE_BRACKET) {
        depth++;
      } else if (this.__stack[i].group & ButtonGroup.OPEN_BRACKET) {
        depth--;
      } else if (this.__stack[i].group & ButtonGroup.SEPARATOR && depth == 1) {
        separators++;
      }
    }

    // Get required arguments count
    // (defaults to 0-0 -> if inspected body is not a registered function)
    const data = this.__functions.get(this.__stack[i]?.value) ?? {
      min: 0,
      max: 0,
    };
    return {
      // Additional separators are allowed if max arguments count was not exceeded
      separator: separators < data.max - 1,
      // Close bracket are allowed if it's number was lower than open bracket and...
      // ...if closing body has enough arguments passed (separators)
      close_bracket:
        counts.open > counts.close &&
        data.min - 1 <= separators &&
        separators <= data.max,
    };
  }

  /**
   * Performs check about dots
   *
   * @returns whenever dot can be appended
   */
  private checkDot(): boolean {
    const copy = [...this.__stack].reverse();
    const element = copy.find((c) => c.group & ~ButtonGroup.NUMBER);
    return (
      ((element?.group ?? ButtonGroup.NONE) & ButtonGroup.DOT) ==
        ButtonGroup.NONE && copy.length > 0
    );
  }

  /**
   * Checks which button groups can be appended to expression
   *
   * @returns Result of bitwise operations on ButtonGroups values
   */
  nextValidGroups(): ButtonGroup {
    let result: ButtonGroup = ButtonGroup.NONE;

    // What can be a starting point in stack
    if (this.__stack.length === 0) {
      this.__valid = true;
      return (
        result |
        ButtonGroup.NUMBER |
        ButtonGroup.UNARY_LEFT |
        ButtonGroup.FUNCTION |
        ButtonGroup.CONSTANT |
        ButtonGroup.OPEN_BRACKET
      );
    }

    // Bitwise OR matching groups (what can go after)
    let last: ButtonGroup = this.__stack[this.__stack.length - 1].group;
    for (let i = 1; i <= ButtonGroup.CLOSE_BRACKET; i <<= 1) {
      if (i & last) {
        result |= NextGroup.get(i as ButtonGroup)!;
      }
    }

    // check if dot is allowed
    if (!this.checkDot()) {
      result &= ~ButtonGroup.DOT;
    }

    // check if separator and close bracket are allowed
    const { separator, close_bracket } = this.checkArgs();

    // If separator is not allowed then exclude SEPARATOR group
    if (!separator) {
      result &= ~ButtonGroup.SEPARATOR;
    }

    // Set valid property
    this.__valid = (last & (
      ButtonGroup.CLOSE_BRACKET |
      ButtonGroup.CONSTANT |
      ButtonGroup.NUMBER |
      ButtonGroup.UNARY_RIGHT)) > 0;

    // If close bracket is not allowed then exclude CLOSE_BRACKET group...
    // ...and update valid property (now we have complete knowledge about expression)
    if (!close_bracket) {
      result &= ~ButtonGroup.CLOSE_BRACKET;
    } else {
      this.__valid = false;
    }

    return result;
  }
}
