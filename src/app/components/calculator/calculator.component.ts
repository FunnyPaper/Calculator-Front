import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ButtonGroup } from 'src/app/enums/button-group.enum';
import { SpecialToken } from 'src/app/enums/special-token.enum';
import ButtonCustomEvent from 'src/app/events/button-custom-event.event';
import IButtonLayout from 'src/app/interfaces/button-layout.interface';
import { ICombinationKeyData } from 'src/app/interfaces/combination-key-data.interface';
import IExpressionRecord from 'src/app/interfaces/expression-record.interface';
import IFunctionData from 'src/app/interfaces/function-data.interface';
import { Button } from 'src/app/models/button.model';
import { ExpressionStack } from 'src/app/models/expression-stack.model';
import { SpecialButton } from 'src/app/models/special-button.model';
import { TokenButton } from 'src/app/models/token-button.model';
import { TokenData } from 'src/app/models/token-data.model';
import { CalculatorService } from 'src/app/services/calculator.service';

@Component({
  selector: 'app-calculator[ButtonLayout][FunctionData]',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit, OnDestroy {
  @Input() ButtonLayout!: IButtonLayout[];
  @Input() FunctionData!: IFunctionData[];
  private __calculatorServiceSubscriptions!: Subscription;
  private __expressionStack!: ExpressionStack;
  private __historyObservable$!: Observable<IExpressionRecord[]>;
  private __ans: string = '0';

  set Ans(value: string) {
    this.__ans = value;
  }
  get Ans(): string {
    return this.__ans;
  }

  /**
   * Provides access to buttons layout variable
   *
   * @readonly
   * @type {IButtonLayout[]}
   * @memberof AppComponent
   */
  get ButtonsLayout(): IButtonLayout[] {
    return this.ButtonLayout;
  }

  /**
   * Provides access to calculator operations history variable
   *
   * @readonly
   * @type {Observable<IExpressionRecord[]>}
   * @memberof AppComponent
   */
  get HistoryObservable$(): Observable<IExpressionRecord[]> {
    return this.__historyObservable$;
  }

  /**
   * Provides access to expression stack's display value
   *
   * @readonly
   * @type {string}
   * @memberof AppComponent
   */
  get Display(): string {
    return this.__expressionStack.Stack.map(
      (t) => (TokenButton.getRegisteredTokenButton(t) as TokenButton).value
    ).join('');
  }

  constructor(private __calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.__calculatorServiceSubscriptions = new Subscription();
    this.__expressionStack = new ExpressionStack();
    this.FunctionData.forEach((f) =>
      this.__expressionStack.registerFunction(f)
    );
    this.updateHistory();
  }

  ngOnDestroy(): void {
    this.__calculatorServiceSubscriptions.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let combination: ICombinationKeyData = {
      alt: event.altKey,
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
    };
    let button = Button.getRegisteredKey({ value: event.code, combination }) as
      | Button
      | undefined;
    if (button) {
      this.dispatchButton(button);
    }
  }

  /**
   * Tries to append given string to expression stack (parsed as tokens)
   *
   * @param displayValue value to be added
   */
  appendAns() {
    // Array for mapped values
    let keysToappend: TokenButton[];

    // Check for scientific notation (ex 1e-10)
    // Such number is to be treated as dynamic CONSTANT
    if (/e(?:-|\+)\d+$/i.test(this.Ans)) {
      keysToappend = [
        new TokenButton(
          new TokenData(this.Ans, ButtonGroup.CONSTANT),
          this.Ans
        ),
      ];
    } else {
      keysToappend = [
        // Tokenize value
        ...this.Ans.matchAll(TokenData.Regex),
      ]
        // Filter out empty (undefined and/ or null values)
        .filter((m) => m[0])
        // Get appropriate button from mapping
        .map(
          (m) =>
            TokenButton.getRegisteredTokenButton(
              TokenData.getRegisteredTokenData(m[0]!) as TokenData
            ) as TokenButton
        );
    }

    // Send parsed buttons to expression stack
    keysToappend.forEach((b) => this.dispatchButton(b));
  }

  /**
   * Terminates current expression stack (send expression to backend, clear stack and append result)
   */
  private evaluate() {
    // Store subscription to dispose it later
    this.__calculatorServiceSubscriptions.add(
      // Call service to send expression stack's packed value (expression + options)
      this.__calculatorService
        .evaluate(this.__expressionStack.Expression)
        .subscribe((e) => {
          // Always clear expression stack
          this.__expressionStack.clear();
          this.Ans = e;
          this.appendAns();
          // Refresh history (it now contains the last expression's result)
          this.updateHistory();
        })
    );
  }

  /**
   * Get calculator's fresh history
   */
  private updateHistory() {
    this.__historyObservable$ = this.__calculatorService.history();
  }

  dispatchButtonEvent(e: ButtonCustomEvent): void {
    this.dispatchButton(e.buttonData);
  }

  private dispatchButton(...buttons: Button[]): void {
    for (let button of buttons) {
      if (button instanceof SpecialButton) {
        this.dispatchSpecialButton(button);
      } else if (button instanceof TokenButton) {
        // Specific rules for '0'
        if (
          /(?:^|[^0-9.])0$/.test(this.Display) &&
          /\d+/.test(button.tokenData.value)
        ) {
          this.__expressionStack.pop();
        }
        this.__expressionStack.append(button.tokenData);
      }
    }
  }

  isValidButton(b: Button): boolean {
    if (b instanceof SpecialButton) {
      return this.isValidSpecialButton(b);
    }
    if (b instanceof TokenButton) {
      return (this.__expressionStack.nextValidGroups() & b.tokenData.group) > 0;
    }
    return true;
  }

  private dispatchSpecialButton(button: SpecialButton) {
    switch (button.specialType) {
      case SpecialToken.AC:
          this.__expressionStack.clear();
        break;
      case SpecialToken.BACK:
          this.__expressionStack.pop();
        break;
      case SpecialToken.RAD:
        this.__expressionStack.Options = { rad: true };
        break;
      case SpecialToken.DEG:
        this.__expressionStack.Options = { rad: false };
        break;
      case SpecialToken.EQUALS:
        {
          if (this.__expressionStack.isValid) {
            this.evaluate();
          }
        }
        break;
      case SpecialToken.ANS:
        this.appendAns();
        break;
    }
  }

  private isValidSpecialButton(button: SpecialButton): boolean {
    switch (button.specialType) {
      case SpecialToken.RAD:
        return !this.__expressionStack.Options.rad!;
      case SpecialToken.DEG:
        return this.__expressionStack.Options.rad!;
      case SpecialToken.EQUALS:
        return this.__expressionStack.isValid;
      default:
        return true;
    }
  }
}
