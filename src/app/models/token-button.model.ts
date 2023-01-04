import { IButton, Button } from './button.model';
import TokenData from './token-data.model';

export interface ITokenButton extends IButton {
  get tokenData(): TokenData;
}

export class TokenButton extends Button implements ITokenButton {
  constructor(protected readonly _token: TokenData, value: string) {
    super(value);
  }
  get tokenData(): TokenData {
    return this._token;
  }
}
