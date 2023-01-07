import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { ButtonGroup } from '../enums/button-group.enum';
import { Button } from '../models/button.model';
import { SpecialButton } from '../models/special-button.model';
import { TokenButton } from '../models/token-button.model';

@Directive({
  selector: 'button[custom-button-class][toBeReplaced][string]'
})
export class CustomButtonClassDirective implements OnInit {
  @Input() toBeReplaced!: string;
  @Input() string!: string;
  @Input() customButton!: Button;
  @Input('class')
  @HostBinding('class') classes!: string;
  ngOnInit(): void {
    this.classes += ' ' + this.string.replace(this.toBeReplaced, this.getScssModifier(this.customButton));
  }

  private getScssModifier(b: Button): string {
    if(b instanceof SpecialButton) {
      return `special`;
    }
    if (b instanceof TokenButton) {
      if((b.tokenData.group & (ButtonGroup.BINARY |
        ButtonGroup.UNARY_LEFT |
        ButtonGroup.UNARY_RIGHT)) > 0) {
          return 'operator';
      }
      if((b.tokenData.group & (ButtonGroup.CONSTANT |
        ButtonGroup.NUMBER)) > 0) {
          return 'operand';
      }
      if((b.tokenData.group & ButtonGroup.FUNCTION) > 0) {
          return 'function';
      }
    }
    return '';
  }
}
