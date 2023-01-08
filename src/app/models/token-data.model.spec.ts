import { Button } from 'src/app/models/button.model';
import { TokenData } from 'src/app/models/token-data.model';
import { ButtonGroup } from '../enums/button-group.enum';

describe('TokenData', () => {
  let token: TokenData;

  afterEach(() => {
    TokenData['__tokenDataRegistry'].clear();
  });

  beforeEach(() => {
    TokenData['__tokenDataRegistry'].clear();
  });

  it('constructor throws on invalid ButtonGroup', () => {
    expect(() => new TokenData('invalid', 2 << 12)).toThrow();
  });

  it('getters', () => {
    token = new TokenData('test', ButtonGroup.NUMBER);
    expect(token.value).toEqual('test');
    expect(token.group).toEqual(ButtonGroup.NUMBER);
  });

  it('set/get/constructor', () => {
    TokenData.setRegisteredTokenData('test', new TokenData('other', ButtonGroup.DOT));
    expect(TokenData.getRegisteredTokenData('test')).toBeTruthy();
    expect((TokenData.getRegisteredTokenData() as [string, TokenData][]).length).toBe(2);

    // Given token can be reused as other key
    expect(TokenData.getRegisteredTokenData('test')).toEqual(TokenData.getRegisteredTokenData('other'));

    token = new TokenData('test', ButtonGroup.CONSTANT);
    expect(token).toEqual(TokenData.getRegisteredTokenData('test') as TokenData);
    expect((TokenData.getRegisteredTokenData() as [string, TokenData][]).length).toBe(2);
  })

  it('Regex', () => {
    new TokenData('A', ButtonGroup.BINARY);
    new TokenData('ANS', ButtonGroup.BINARY);
    expect(TokenData.Regex.source).toBe('[A]|ANS');
  });
});
