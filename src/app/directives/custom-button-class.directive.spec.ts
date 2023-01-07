import { CustomButtonClassDirective } from './custom-button-class.directive';
import { ButtonGroup } from './../enums/button-group.enum';
import { TokenData } from 'src/app/models/token-data.model';
import { TokenButton } from 'src/app/models/token-button.model';
import { SpecialToken } from './../enums/special-token.enum';
import { SpecialButton } from 'src/app/models/special-button.model';

describe('CustomButtonClassDirective', () => {
  let directive: CustomButtonClassDirective;
  const cssClass: string = 'class_1';

  beforeEach(() => {
    directive = new CustomButtonClassDirective();
    directive.toBeReplaced = '*';
    directive.string = 'test-*';
    directive.classes = cssClass;
    expect(directive).toBeTruthy();
  });

  it('special', () => {
    directive.customButton = new SpecialButton(SpecialToken.ANS, '');
    directive.ngOnInit();
    expect(directive.classes).toEqual(`${cssClass} test-special`)
  });

  it('operator', () => {
    directive.customButton = new TokenButton(new TokenData('', ButtonGroup.BINARY), '');
    directive.ngOnInit();
    expect(directive.classes).toEqual(`${cssClass} test-operator`)
  });

  it('operand', () => {
    directive.customButton = new TokenButton(new TokenData('', ButtonGroup.CONSTANT), '');
    directive.ngOnInit();
    expect(directive.classes).toEqual(`${cssClass} test-operand`)
  });

  it('function', () => {
    directive.customButton = new TokenButton(new TokenData('', ButtonGroup.FUNCTION), '');
    directive.ngOnInit();
    expect(directive.classes).toEqual(`${cssClass} test-function`)
  });

  it('unmatched', () => {
    directive.customButton = new TokenButton(new TokenData('', ButtonGroup.OPEN_BRACKET), '');
    directive.ngOnInit();
    expect(directive.classes).toEqual(`${cssClass} test-`)
  });
});
