import { SpecialToken } from './../enums/special-token.enum';
import { SpecialButton } from 'src/app/models/special-button.model';
import { Button } from './button.model';

describe('Button', () => {

  describe('without key', () => {
    let button: Button;
    beforeEach(() => {
      Button['__buttonRegistry'].clear();
      Button['__keysRegistry'].clear();
      button = new SpecialButton(SpecialToken.ANS, '');
      expect(button.key).not.toBeDefined();
      expect(button.value).toEqual('');
    });

    it('registry', () => {
      expect(Button.getRegisteredButton(button.value) as Button).toEqual(button);
      expect(Button.getRegisteredButton()).toEqual([[button.value, button]]);
      expect(Button.getRegisteredKey()).toEqual([]);
    });
  });

  describe('with key (and combination)', () => {
    let button: Button;
    beforeEach(() => {
      Button['__buttonRegistry'].clear();
      Button['__keysRegistry'].clear();
      button = new SpecialButton(SpecialToken.ANS, '', { value: '', combination: { alt: true }});
      expect(button.key).toEqual({ value: '', combination: { alt: true, ctrl: false, shift: false }});
      expect(button.value).toEqual('');
    });

    it('registry', () => {
      expect(Button.getRegisteredButton(button.value) as Button).toEqual(button);
      expect(Button.getRegisteredButton()).toEqual([[button.value, button]]);
      expect(Button.getRegisteredKey(button.key) as Button).toEqual(button);
      expect(Button.getRegisteredKey()).toEqual([[button.key!, button]]);
      expect(Button.getRegisteredKey(button.key) as Button).toEqual(
        Button.getRegisteredButton(button.value) as Button
      );
    });
  });
});
