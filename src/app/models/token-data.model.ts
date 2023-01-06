import { ButtonGroup } from '../enums/button-group.enum';

export default class TokenData {
  private static readonly __tokenDataRegistry: Map<string, TokenData> = new Map();
  constructor(
    private readonly __value: string,
    private readonly __group: ButtonGroup
  ) {
    if (
      !Object.values(ButtonGroup).some(
        (k) => k == __group || ((k as ButtonGroup) & __group) > 0
      )
    ) {
      throw new Error('Invalid token group');
    }
    TokenData.__tokenDataRegistry.set(this.__value, this);
  }
  get value(): string {
    return this.__value;
  }
  get group(): ButtonGroup {
    return this.__group;
  }
  static get Regex(): RegExp {
    return new RegExp(
      [...TokenData.__tokenDataRegistry.values()]
        .map((k) => (k.value.length > 1 ? `${k.value}` : `[${k.value}]`))
        .join('|'),
      'g'
    );
  }
  static getRegisteredTokenData(key?: string): [string, TokenData][] | TokenData | undefined {
    if (key) {
      return TokenData.__tokenDataRegistry.get(key);
    }

    return [...TokenData.__tokenDataRegistry.entries()];
  }
  static setRegisteredTokenData(key: string, button: TokenData): void {
    TokenData.__tokenDataRegistry.set(key, button);
  }
}
