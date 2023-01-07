import { IButton } from '../interfaces/button.interface';
import { IKeyData } from '../interfaces/key-data.interface';
import { Button } from './button.model';
import { TokenData } from './token-data.model';

export interface ITokenButton extends IButton {
  get tokenData(): TokenData;
}

export class TokenButton extends Button implements ITokenButton {
  private static readonly __tokenDataRegistry: Map<TokenData, TokenButton> = new Map();
  constructor(protected readonly _token: TokenData, value: string, keyData?: IKeyData) {
    super(value, keyData);
    TokenButton.setRegisteredTokenButton(this._token, this);
  }
  get tokenData(): TokenData {
    return this._token;
  }
  static setRegisteredTokenButton(key: TokenData, button: TokenButton): void {
    TokenButton.__tokenDataRegistry.set(key, button);
  }
  static getRegisteredTokenButton(
    key?: TokenData
  ): [TokenData, TokenButton][] | TokenButton | undefined {
    if (key) {
      return [...TokenButton.__tokenDataRegistry.entries()].find(
        (p) => JSON.stringify(p[0]) === JSON.stringify(key)
      )?.[1];
    }

    return [...TokenButton.__tokenDataRegistry.entries()];
  }
}
