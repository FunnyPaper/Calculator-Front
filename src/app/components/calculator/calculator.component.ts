import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ButtonGroup } from 'src/app/enums/button-group.enum';
import { SpecialToken } from 'src/app/enums/special-token.enum';
import ButtonCustomEvent from 'src/app/events/button-custom-event.event';
import IButtonLayout from 'src/app/interfaces/button-layout.interface';
import IExpressionRecord from 'src/app/interfaces/expression-record.interface';
import IFunctionData from 'src/app/interfaces/function-data.interface';
import { Button } from 'src/app/models/button.model';
import { ExpressionStack } from 'src/app/models/expression-stack.model';
import { SpecialButton } from 'src/app/models/special-button.model';
import { TokenButton } from 'src/app/models/token-button.model';
import TokenData from 'src/app/models/token-data.model';
import { CalculatorService } from 'src/app/services/calculator.service';

@Component({
  selector: 'app-calculator[ButtonLayout][ButtonMapping][FunctionData]',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit, OnDestroy {
  @Input() ButtonLayout!: IButtonLayout[];
  @Input() ButtonMapping!: Map<TokenData, TokenButton>;
  @Input() FunctionData!: IFunctionData[];
  private __calculatorServiceSubscriptions!: Subscription;
  private __expressionStack!: ExpressionStack;
  private __historyObservable$!: Observable<IExpressionRecord[]>;

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
    return this.__expressionStack.Stack.map(t => t.value).join('');
  }

  constructor(private __calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.__calculatorServiceSubscriptions = new Subscription();
    this.__expressionStack = new ExpressionStack();
    this.FunctionData.forEach(f => this.__expressionStack.registerFunction(f));
    this.updateHistory();
    this.appendAns('0');
  }

  ngOnDestroy(): void {
    this.__calculatorServiceSubscriptions.unsubscribe();
  }

  /**
   * Tries to append given string to expression stack (parsed as tokens)
   *
   * @param displayValue value to be added
   */
  appendAns(displayValue: string) {
    // Array for mapped values
    let keysToappend: TokenData[];

    // Check for scientific notation (ex 1e-10)
    // Such number is to be treated as dynamic CONSTANT
    if (/e(?:-|\+)\d+$/i.test(displayValue)) {
      keysToappend = [
        new TokenData(displayValue, ButtonGroup.CONSTANT)
      ];
    } else {
      keysToappend = [
        // Tokenize value
        ...displayValue.matchAll(
          RegExp(
            // Regex consists of mapping keys
            [...this.ButtonMapping.keys()]
              .map((k) => {
                // TODO: Better handling of special regex characters
                return k.value.length > 1 ? `${k.value}` : `[${k.value}]`;
              })
              .join('|'),
            'g'
          )
        ),
      ]
        // Filter out empty (undefined and/ or null values)
        .filter((m) => m[0])
        // Get appropriate button from mapping
        .map((m) => [...this.ButtonMapping.entries()].find(e => e[0].value == m[0])![0]);
    }

    // Send parsed buttons to expression stack
    this.__expressionStack.append(...keysToappend);
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
          this.appendAns(e);
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

  dispatchButton(e: ButtonCustomEvent): void {
    if(e.buttonData instanceof SpecialButton) {
      this.dispatchSpecialButton(e.buttonData);
    } else if (e.buttonData instanceof TokenButton) {
      if(/^0$/.test(this.Display) && /\d+/.test(e.buttonData.tokenData.value)) {
        this.__expressionStack.pop();
      }
      this.__expressionStack.append(e.buttonData.tokenData);
    }
  }

  isValidButton(b: Button): boolean {
    if(b instanceof SpecialButton) {
      return this.isValidSpecialButton(b);
    }
    if (b instanceof TokenButton) {
      // Specific rules for '0'
      if(/[^0-9.]0$/.test(this.Display) && /\d+/.test(b.value)) {
        return false
      }
      return (this.__expressionStack.nextValidGroups() & b.tokenData.group) > 0;
    }
    return true;
  }

  private dispatchSpecialButton(button: SpecialButton) {
    switch(button.specialType) {
      case SpecialToken.AC:
      {
        this.__expressionStack.clear();
      }
        break;
      case SpecialToken.BACK:
      {
        this.__expressionStack.pop();
        if (this.__expressionStack.Stack.length === 0) {
        }
      }
        break;
      case SpecialToken.RAD: this.__expressionStack.Options = { rad: true };
        break;
      case SpecialToken.DEG: this.__expressionStack.Options = { rad: false };
        break;
      case SpecialToken.EQUALS: this.evaluate();
        break;
    }
  }

  private isValidSpecialButton(button: SpecialButton): boolean {
    switch(button.specialType) {
      case SpecialToken.AC:
      case SpecialToken.BACK: return true;
      case SpecialToken.RAD: return !this.__expressionStack.Options.rad!;
      case SpecialToken.DEG: return this.__expressionStack.Options.rad!;
      case SpecialToken.EQUALS: return this.__expressionStack.isValid;
    }
  }
}
