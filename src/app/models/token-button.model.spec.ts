import { TokenData } from './token-data.model';
import { TokenButton } from "./token-button.model";
import { ButtonGroup } from '../enums/button-group.enum';

describe('TokenButton', () => {
  let button: TokenButton;
  let token: TokenData;

  beforeEach(() => {
    TokenButton['__tokenDataRegistry'].clear();
    TokenData['__tokenDataRegistry'].clear();
    token = new TokenData('', ButtonGroup.NUMBER);
  });

  afterEach(() => {
    TokenButton['__tokenDataRegistry'].clear();
    TokenData['__tokenDataRegistry'].clear();
  });

  it('getter', () => {
    button = new TokenButton(token, '');
    expect(button.tokenData).toEqual(token);
  });

  it('set/get/constructor', () => {
    button = new TokenButton(token, '');
    TokenButton.setRegisteredTokenButton(token, button);
    expect(TokenButton.getRegisteredTokenButton(token)).toBeTruthy();
    expect((TokenButton.getRegisteredTokenButton() as [TokenData, TokenButton][]).length).toBe(1);

    // Set other key
    token = new TokenData('test', ButtonGroup.CONSTANT);
    expect(button).not.toEqual(TokenButton.getRegisteredTokenButton(token) as TokenButton);
    expect((TokenButton.getRegisteredTokenButton() as [TokenData, TokenButton][]).length).toBe(1);
  })
});
