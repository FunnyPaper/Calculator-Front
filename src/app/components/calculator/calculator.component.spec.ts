import { ButtonGroup } from './../../enums/button-group.enum';
import { TokenButton } from 'src/app/models/token-button.model';
import IExpressionRecord from 'src/app/interfaces/expression-record.interface';
import { SpecialToken } from './../../enums/special-token.enum';
import { SpecialButton } from 'src/app/models/special-button.model';
import { Button } from 'src/app/models/button.model';
import { AppModule } from './../../app.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorService } from 'src/app/services/calculator.service';

import { CalculatorComponent } from './calculator.component';
import { of } from 'rxjs';
import { ExpressionStack } from 'src/app/models/expression-stack.model';
import { TokenData } from 'src/app/models/token-data.model';
import ButtonCustomEvent from 'src/app/events/button-custom-event.event';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorComponent],
      imports: [HttpClientTestingModule, AppModule],
      providers: [CalculatorService],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    component.ButtonLayout = [];
    component.FunctionData = [];
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters/setters', () => {
    beforeEach(() => {
      component.ButtonLayout = [
        {
          label: 'test',
          buttons: [new SpecialButton(SpecialToken.ANS, 'value')],
        },
      ];
    });

    it('Ans', () => {
      expect(component['__ans']).toEqual('0');
      expect(component.Ans).toEqual('0');

      component.Ans = '2';

      expect(component['__ans']).toEqual('2');
      expect(component.Ans).toEqual('2');

      component['__ans'] = '4';

      expect(component['__ans']).toEqual('4');
      expect(component.Ans).toEqual('4');
    });

    it('ButtonsLayout', () => {
      expect(component.ButtonsLayout).toEqual(component.ButtonLayout);
    });

    it('HistoryObservable$', (done) => {
      const record: IExpressionRecord[] = [
        {
          expression: '2+2',
          result: '4',
        },
      ];
      component['__historyObservable$'] = of(record);
      component.HistoryObservable$.subscribe((r: IExpressionRecord[]) => {
        expect(r).toEqual(record);
        done();
      });
    });

    it('Display', () => {
      const buttons: TokenButton[] = [
        new TokenButton(new TokenData('1', ButtonGroup.NUMBER), '1'),
        new TokenButton(new TokenData('+', ButtonGroup.BINARY), '+'),
        new TokenButton(new TokenData('2', ButtonGroup.NUMBER), '2'),
      ];
      component['__expressionStack'].append(...buttons.map((b) => b.tokenData));
      expect(component.Display).toEqual(buttons.map((b) => b.value).join(''));
    });
  });

  describe('appendAns', () => {
    let ans: string = '';
    beforeEach(() => {
      component['__expressionStack'].clear();
    });
    it('scientific', () => {
      ans = '2e-10';
      component.Ans = ans;
      component.appendAns();
      expect(component.Display).toEqual(ans);
    });

    it('simple', () => {
      ans = '-10';
      new TokenButton(new TokenData('-', ButtonGroup.UNARY_LEFT), '-');
      new TokenButton(new TokenData('1', ButtonGroup.NUMBER), '1');
      new TokenButton(new TokenData('0', ButtonGroup.NUMBER), '0');
      component.Ans = ans;
      component.appendAns();
      expect(component.Display).toEqual(ans);
      component.appendAns();
      expect(component.Display).toEqual(ans + ans);
    });

    it('floating', () => {
      ans = '2.2';
      new TokenButton(new TokenData('.', ButtonGroup.DOT), '.');
      new TokenButton(new TokenData('2', ButtonGroup.NUMBER), '2');
      component.Ans = ans;
      component.appendAns();
      expect(component.Display).toEqual(ans);
      component.appendAns();
      // skips invalid characters in ans
      expect(component.Display).toEqual(ans + '22');
    });
  });

  it('evaluate', () => {
    spyOn(component['__calculatorServiceSubscriptions'], 'add');
    component['evaluate']();
    fixture.detectChanges();
    expect(
      component['__calculatorServiceSubscriptions'].add
    ).toHaveBeenCalled();
  });

  it('updateHistory', () => {
    const lastHistory = component.HistoryObservable$;
    expect(lastHistory).toEqual(component.HistoryObservable$);

    component['updateHistory']();
    expect(lastHistory).not.toEqual(component.HistoryObservable$);
  });

  describe('dispatchButtonEvent', () => {
    describe('dispatchButton', () => {
      const tokenButtons: TokenButton[] = [
        new TokenButton(new TokenData('0', ButtonGroup.NUMBER), '0'),
        new TokenButton(new TokenData('1', ButtonGroup.NUMBER), '1'),
      ];

      it('0 first', () => {
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), tokenButtons[0])
        );
        expect(component.Display).toEqual(tokenButtons[0].value);
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), tokenButtons[1])
        );
        expect(component.Display).toEqual(tokenButtons[1].value);
      });

      it('no 0', () => {
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), tokenButtons[1])
        );
        expect(component.Display).toEqual(tokenButtons[1].value);
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), tokenButtons[1])
        );
        expect(component.Display).toEqual(
          tokenButtons[1].value + tokenButtons[1].value
        );
      });
    });

    describe('dispatchSpecialButton', () => {
      const specialButtons: SpecialButton[] = [
        new SpecialButton(SpecialToken.AC, 'special'),
        new SpecialButton(SpecialToken.BACK, 'special'),
        new SpecialButton(SpecialToken.RAD, 'special'),
        new SpecialButton(SpecialToken.DEG, 'special'),
        new SpecialButton(SpecialToken.EQUALS, 'special'),
        new SpecialButton(SpecialToken.ANS, 'special'),
      ];

      it('AC', () => {
        spyOn(component['__expressionStack'], 'clear');
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), specialButtons[0])
        );
        expect(component['__expressionStack'].clear).toHaveBeenCalled();
      })

      it('BACK', () => {
        spyOn(component['__expressionStack'], 'pop');
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), specialButtons[1])
        );
        expect(component['__expressionStack'].pop).toHaveBeenCalled();
      })

      it('RAD', () => {
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), specialButtons[2])
        );
        expect(component['__expressionStack'].Options).toEqual({ rad: true });
      })

      it('DEG', () => {
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), specialButtons[3])
        );
        expect(component['__expressionStack'].Options).toEqual({ rad: false });
      })

      it('EQUALS', () => {
        spyOn(component as any, 'evaluate');
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), specialButtons[4])
        );
        expect(component['evaluate']).toHaveBeenCalled();
      })

      it('ANS', () => {
        spyOn(component, 'appendAns');
        component.dispatchButtonEvent(
          new ButtonCustomEvent(new Event('click'), specialButtons[5])
        );
        expect(component.appendAns).toHaveBeenCalled();
      })

    });
  });

  describe('isValidButton', () => {
    describe('isValidSpecialButton', () => {});
  });
});
