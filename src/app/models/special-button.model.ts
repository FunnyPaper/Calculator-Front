import { SpecialToken } from './../enums/special-token.enum';
import { Button, IButton } from './button.model';

export interface ISpecialButton extends IButton {
  get specialType(): SpecialToken;
}

export class SpecialButton extends Button implements ISpecialButton {
  constructor(protected readonly _specialType: SpecialToken, value: string) {
    if (!SpecialToken[_specialType]) {
      throw new Error('_specialType expects exact type');
    }
    super(value);
  }
  get specialType(): SpecialToken {
    return this._specialType;
  }
}
