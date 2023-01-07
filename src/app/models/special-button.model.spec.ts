import { SpecialToken } from './../enums/special-token.enum';
import { SpecialButton } from 'src/app/models/special-button.model';

describe('SpecialButton', () => {
  let button: SpecialButton;

  it('getter', () => {
    button = new SpecialButton(SpecialToken.ANS, '');
    expect(button.specialType).toEqual(SpecialToken.ANS);
  });
});
