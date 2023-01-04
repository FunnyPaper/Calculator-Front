import { IExpressionOptions } from './../interfaces/expression-data.interface';
import { ButtonGroup } from '../enums/button-group.enum';
import { ExpressionStack } from './expression-stack.model';
import TokenData from './token-data.model';

describe('ExpressionStack', () => {
  const tokens: Map<ButtonGroup, TokenData> = new Map(
    Object.values(ButtonGroup).map((v, i) => {
      return [
        v as ButtonGroup,
        new TokenData(`TOKEN${i}`, v as ButtonGroup)
      ];
    })
  );

  let stack: ExpressionStack;

  beforeEach(() => {
    stack = new ExpressionStack();
  });

  it('create an instance', () => {
    expect(stack).toBeTruthy();
  });

  it('tokens are valid', () => {
    expect([...tokens.keys()].length).toEqual(Object.keys(ButtonGroup).length);
    expect(tokens.get(ButtonGroup.NUMBER)).toBeTruthy();
    expect(tokens.get(ButtonGroup.NONE)).toBeTruthy();
    expect(tokens.get(ButtonGroup.DOT)).toBeTruthy();
    expect(tokens.get(ButtonGroup.NUMBER)).toBeTruthy();
    expect(tokens.get(ButtonGroup.UNARY_LEFT)).toBeTruthy();
    expect(tokens.get(ButtonGroup.UNARY_RIGHT)).toBeTruthy();
    expect(tokens.get(ButtonGroup.BINARY)).toBeTruthy();
    expect(tokens.get(ButtonGroup.FUNCTION)).toBeTruthy();
    expect(tokens.get(ButtonGroup.CONSTANT)).toBeTruthy();
    expect(tokens.get(ButtonGroup.SEPARATOR)).toBeTruthy();
    expect(tokens.get(ButtonGroup.OPEN_BRACKET)).toBeTruthy();
    expect(tokens.get(ButtonGroup.CLOSE_BRACKET)).toBeTruthy();
  });

  it('initial getters state', () => {
    expect(stack.Stack.length)
      .withContext('expression stack length')
      .toEqual(0);
    expect(stack.Stack)
      .withContext('expression stack')
      .toEqual([]);
    expect(stack.Expression)
      .withContext('full expression')
      .toEqual({
        expression: '0',
        options: { rad: false },
      });
    expect(stack.Options)
      .withContext('additional options')
      .toEqual({ rad: false });
  });

  describe('append', () => {
    let inputArray: TokenData[];
    let expectedArray: TokenData[];
    let expectedDisplay: string;
    let expectedOptions: IExpressionOptions;

    it('valid tokens', () => {
      inputArray = [
        tokens.get(ButtonGroup.NUMBER)!,
        tokens.get(ButtonGroup.BINARY)!,
        tokens.get(ButtonGroup.NUMBER)!,
      ];
      expectedArray = inputArray;
      expectedOptions = { rad: false };
    });

    it('invalid tokens', () => {
      inputArray = [
        tokens.get(ButtonGroup.DOT)!,
        tokens.get(ButtonGroup.BINARY)!,
        tokens.get(ButtonGroup.CLOSE_BRACKET)!,
        tokens.get(ButtonGroup.SEPARATOR)!,
        tokens.get(ButtonGroup.UNARY_RIGHT)!,
      ];
      expectedArray = [];
      expectedOptions = { rad: false };
    });

    it('valid and invalid tokens few times', () => {
      inputArray = [
        tokens.get(ButtonGroup.DOT)!,
        tokens.get(ButtonGroup.BINARY)!,
        tokens.get(ButtonGroup.DOT)!,
        tokens.get(ButtonGroup.NUMBER)!,
        tokens.get(ButtonGroup.DOT)!,
        tokens.get(ButtonGroup.CLOSE_BRACKET)!,
        tokens.get(ButtonGroup.CONSTANT)!,
        tokens.get(ButtonGroup.NUMBER)!,
      ];
      expectedArray = [
        tokens.get(ButtonGroup.NUMBER)!,
        tokens.get(ButtonGroup.DOT)!,
        tokens.get(ButtonGroup.NUMBER)!,
      ];
      expectedOptions = { rad: false };
    });

    afterEach(() => {
      // Set expected display
      expectedDisplay = expectedArray.map((e) => e.value).join('');

      // Append tokens
      inputArray.forEach(t => stack.append(t));

      // Tests
      expect(stack.Stack.length).toEqual(expectedArray.length);
      expect(stack.Stack).toEqual(expectedArray);
      expect(stack.Expression).toEqual({
        expression: expectedDisplay,
        options: expectedOptions,
      });
    });
  });

  describe('nextValidGroups', () => {
    let inputArray: TokenData[];
    let expectedGroups: ButtonGroup;

    beforeEach(() => {
      stack = new ExpressionStack();
    });
    it('after dot', () => {
      inputArray = [
        tokens.get(ButtonGroup.NUMBER)!,
        tokens.get(ButtonGroup.DOT)!,
      ];
      expectedGroups = ButtonGroup.NUMBER;
    });
    it('after number', () => {
      inputArray = [tokens.get(ButtonGroup.NUMBER)!];
      expectedGroups =
        ButtonGroup.UNARY_RIGHT |
        ButtonGroup.BINARY |
        ButtonGroup.NUMBER |
        ButtonGroup.DOT
    });
    it('after left unary', () => {
      inputArray = [tokens.get(ButtonGroup.UNARY_LEFT)!];
      expectedGroups =
        ButtonGroup.NUMBER |
        ButtonGroup.FUNCTION |
        ButtonGroup.CONSTANT |
        ButtonGroup.OPEN_BRACKET;
    });
    it('after right unary', () => {
      inputArray = [
        tokens.get(ButtonGroup.NUMBER)!,
        tokens.get(ButtonGroup.UNARY_RIGHT)!,
      ];
      expectedGroups =
        ButtonGroup.UNARY_RIGHT | ButtonGroup.BINARY;
    });
    it('after binary', () => {
      inputArray = [
        tokens.get(ButtonGroup.NUMBER)!,
        tokens.get(ButtonGroup.BINARY)!,
      ];
      expectedGroups =
        ButtonGroup.NUMBER |
        ButtonGroup.UNARY_LEFT |
        ButtonGroup.FUNCTION |
        ButtonGroup.CONSTANT |
        ButtonGroup.OPEN_BRACKET;
    });
    it('after function', () => {
      inputArray = [tokens.get(ButtonGroup.FUNCTION)!];
      expectedGroups = ButtonGroup.OPEN_BRACKET;
    });
    it('after constant', () => {
      inputArray = [tokens.get(ButtonGroup.CONSTANT)!];
      expectedGroups =
        ButtonGroup.UNARY_RIGHT | ButtonGroup.BINARY;
    });
    it('after separator', () => {
      inputArray = [
        tokens.get(ButtonGroup.FUNCTION)!,
        tokens.get(ButtonGroup.OPEN_BRACKET)!,
        tokens.get(ButtonGroup.NUMBER)!,
        tokens.get(ButtonGroup.SEPARATOR)!,
      ];
      expectedGroups =
        ButtonGroup.NUMBER |
        ButtonGroup.UNARY_LEFT |
        ButtonGroup.FUNCTION |
        ButtonGroup.CONSTANT |
        ButtonGroup.OPEN_BRACKET;
      // separators are related to custom functions
      const funcData = tokens.get(ButtonGroup.FUNCTION)!;
      stack.registerFunction({
        key: funcData.value,
        args: { max: 2 },
      });
    });
    it('after open bracket', () => {
      inputArray = [tokens.get(ButtonGroup.OPEN_BRACKET)!];
      expectedGroups =
        ButtonGroup.NUMBER |
        ButtonGroup.UNARY_LEFT |
        ButtonGroup.FUNCTION |
        ButtonGroup.CONSTANT |
        ButtonGroup.OPEN_BRACKET;
    });
    it('after close bracket', () => {
      inputArray = [
        tokens.get(ButtonGroup.FUNCTION)!,
        tokens.get(ButtonGroup.OPEN_BRACKET)!,
        tokens.get(ButtonGroup.NUMBER)!,
        tokens.get(ButtonGroup.CLOSE_BRACKET)!,
      ];
      expectedGroups =
        ButtonGroup.UNARY_RIGHT |
        ButtonGroup.BINARY |
        ButtonGroup.SEPARATOR;
      // separators are related to custom functions
      const funcData = tokens.get(ButtonGroup.FUNCTION)!;
      stack.registerFunction({ key: funcData.value });
    });

    afterEach(() => {
      stack.append(...inputArray);
      expect(stack.Stack).withContext('does not match').toEqual(inputArray);
    });
  });

  describe('clear', () => {
    let inputArray: TokenData[];

    it('empty stack', () => {
      expect(stack.Stack).toEqual([]);
      stack.clear()
      expect(stack.Stack).toEqual([]);
    })

    it('not empty stack', () => {
      inputArray = [tokens.get(ButtonGroup.NUMBER)!, tokens.get(ButtonGroup.NUMBER)!];
      stack.append(...inputArray);
      expect(stack.Stack).toEqual(inputArray);
      stack.clear();
      expect(stack.Stack).toEqual([]);
    })
  })

  describe('pop', () => {
    let inputArray: TokenData[];

    it('empty stack', () => {
      expect(stack.Stack).toEqual([]);
      stack.pop()
      expect(stack.Stack).toEqual([]);
    })

    it('not empty stack', () => {
      inputArray = [tokens.get(ButtonGroup.NUMBER)!, tokens.get(ButtonGroup.NUMBER)!];
      stack.append(...inputArray);
      expect(stack.Stack).toEqual(inputArray);
      stack.pop();
      let [x, ...copy] = inputArray;
      expect(stack.Stack).toEqual(copy);
    })
  })

  it('setOptions', () => {
    expect(stack.Options).toEqual({ rad: false });
    stack.Options = { rad: true };
    expect(stack.Options).toEqual({ rad: true });
    stack.Options = { rad: false };
    expect(stack.Options).toEqual({ rad: false });
  });

  it('ValidValueExpression throws', () => {
    stack.append(tokens.get(ButtonGroup.OPEN_BRACKET)!);
    expect(() => stack.Expression).toThrow();
  })
});
