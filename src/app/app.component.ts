import { TokenButton } from './models/token-button.model';
import { SpecialToken } from './enums/special-token.enum';
import { SpecialButton } from './models/special-button.model';
import { Component } from '@angular/core';
import IButtonLayout from './interfaces/button-layout.interface';
import { ButtonGroup } from './enums/button-group.enum';
import { TokenData } from './models/token-data.model';
import IFunctionData from './interfaces/function-data.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private __buttonsLayout!: IButtonLayout[];
  private __buttonMapping!: Map<TokenData, TokenButton>;
  private __functionData!: IFunctionData[];

  get ButtonsLayout(): IButtonLayout[] {
    return this.__buttonsLayout;
  }

  get ButtonMapping(): Map<TokenData, TokenButton> {
    return this.__buttonMapping;
  }

  get FunctionData(): IFunctionData[] {
    return this.__functionData;
  }

  constructor() {
    this.registerFunctions();
    this.registerButtons();
    this.createButtonMapping();
  }

  /**
   * Registers variadic functions' data
   */
  private registerFunctions(): void {
    this.__functionData = [
      { key: 'SIN' },
      { key: 'COS' },
      { key: 'TAN' },
      { key: 'LN' },
      { key: 'LOG', args: { max: 2 } },
      { key: 'POW', args: { max: Number.POSITIVE_INFINITY } },
      { key: 'ROOT', args: { max: Number.POSITIVE_INFINITY } }
    ]
  }

  /**
   * Create mappings based on initialized buttons' layout
   */
  private createButtonMapping(): void {
    this.__buttonMapping = this.ButtonsLayout.map(
      // Map layouts Map objects. Every Button is identified by it's displayValue.
      (l: IButtonLayout) =>
        new Map<TokenData, TokenButton>(
          (l.buttons.filter(b => b instanceof TokenButton) as TokenButton[]).map((b: TokenButton) => [b.tokenData, b])
        )
    ).reduce(
      (previous: Map<TokenData, TokenButton>, current: Map<TokenData, TokenButton>) => {
        // Flatten resulted Array (set new entries by iterating over future Maps) to get single Map object
        current.forEach((value: TokenButton, key: TokenData) =>
          previous.set(key, value)
        );
        return previous;
      }
    );
  }

  /**
   * Initialize buttons' layout
   */
  private registerButtons(): void {
    // TODO: Refactor for greater flexibility. Current problems:
    // 1. Order of definiton defines order of display - this should be seperated
    this.__buttonsLayout = [
      {
        label: 'simple',
        buttons: [
            new SpecialButton(SpecialToken.AC, 'AC', { value: 'Delete' }),
            new SpecialButton(SpecialToken.BACK, 'BACK', { value: 'Backspace' }),
            new TokenButton(new TokenData('%', ButtonGroup.BINARY), '%', { value: 'Digit5', combination: { shift: true }}),
            new TokenButton(new TokenData('/', ButtonGroup.BINARY), ':', { value: 'Semicolon', combination: { shift: true }}),
            new TokenButton(new TokenData('7', ButtonGroup.NUMBER), '7', { value: 'Digit7' }),
            new TokenButton(new TokenData('8', ButtonGroup.NUMBER), '8', { value: 'Digit8' }),
            new TokenButton(new TokenData('9', ButtonGroup.NUMBER), '9', { value: 'Digit9' }),
            new TokenButton(new TokenData('*', ButtonGroup.BINARY), 'x', { value: 'Digit8', combination: { shift: true }}),
            new TokenButton(new TokenData('4', ButtonGroup.NUMBER), '4', { value: 'Digit4' }),
            new TokenButton(new TokenData('5', ButtonGroup.NUMBER), '5', { value: 'Digit5' }),
            new TokenButton(new TokenData('6', ButtonGroup.NUMBER), '6', { value: 'Digit6' }),
            new TokenButton(new TokenData('-', ButtonGroup.BINARY | ButtonGroup.UNARY_LEFT), '-', { value: 'Minus' }),
            new TokenButton(new TokenData('1', ButtonGroup.NUMBER), '1', { value: 'Digit1' }),
            new TokenButton(new TokenData('2', ButtonGroup.NUMBER), '2', { value: 'Digit2' }),
            new TokenButton(new TokenData('3', ButtonGroup.NUMBER), '3', { value: 'Digit3' }),
            new TokenButton(new TokenData('+', ButtonGroup.BINARY), '+', { value: 'Equal' }),
            new TokenButton(new TokenData('.', ButtonGroup.DOT), '.', { value: 'Period' }),
            new TokenButton(new TokenData('0', ButtonGroup.NUMBER), '0', { value: 'Digit0' }),
            new SpecialButton(SpecialToken.EQUALS, '=', { value: 'Enter' }),
        ],
      },
      {
        label: 'scientific',
        buttons: [
          new SpecialButton(SpecialToken.RAD, 'RAD', { value: 'KeyR' }),
          new SpecialButton(SpecialToken.DEG, 'DEG', { value: 'KeyD' }),
          new TokenButton(new TokenData(',', ButtonGroup.SEPARATOR), ',', { value: 'Comma' }),
          new TokenButton(new TokenData('!', ButtonGroup.UNARY_RIGHT), '!', { value: 'Digit1', combination: { shift: true }}),
          new TokenButton(new TokenData('SIN', ButtonGroup.FUNCTION), 'SIN'),
          new TokenButton(new TokenData('LN', ButtonGroup.FUNCTION), 'LN'),
          new TokenButton(new TokenData('(', ButtonGroup.OPEN_BRACKET), '(', { value: 'Digit9', combination: { shift: true }}),
          new TokenButton(new TokenData(')', ButtonGroup.CLOSE_BRACKET), ')', { value: 'Digit0', combination: { shift: true }}),
          new TokenButton(new TokenData('COS', ButtonGroup.FUNCTION), 'COS'),
          new TokenButton(new TokenData('LOG', ButtonGroup.FUNCTION), 'LOG'),
          new TokenButton(new TokenData('PI', ButtonGroup.CONSTANT), 'π', { value: 'KeyP' }),
          new TokenButton(new TokenData('E', ButtonGroup.CONSTANT), 'e', { value: 'KeyE' }),
          new TokenButton(new TokenData('TAN', ButtonGroup.FUNCTION), 'TAN'),
          new TokenButton(new TokenData('ROOT', ButtonGroup.FUNCTION), 'ROOT'),
          new TokenButton(new TokenData('POW', ButtonGroup.FUNCTION), 'POW'),
          new SpecialButton(SpecialToken.ANS, 'ANS', { value: 'KeyA' }),
        ],
      },
    ];
  }
}
