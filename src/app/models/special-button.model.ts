import { IButton } from '../interfaces/button.interface';
import { IKeyData } from '../interfaces/key-data.interface';
import { SpecialToken } from './../enums/special-token.enum';
import { Button } from './button.model';

export interface ISpecialButton extends IButton {
  get specialType(): SpecialToken;
}

export class SpecialButton extends Button implements ISpecialButton {
  constructor(protected readonly _specialType: SpecialToken, value: string, keyData?: IKeyData) {
    if (!SpecialToken[_specialType]) {
      throw new Error('_specialType expects exact type');
    }
    super(value, keyData);
  }
  get specialType(): SpecialToken {
    return this._specialType;
  }
}
