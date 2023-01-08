import ButtonCustomEvent from 'src/app/events/button-custom-event.event';
import { SpecialButton } from 'src/app/models/special-button.model';
import { Component } from '@angular/core';
import { CustomClickDirective } from './custom-click.directive';
import { SpecialToken } from '../enums/special-token.enum';
import { Button } from '../models/button.model';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <button
    custom-click
    (customClick)="dispatch($event)"
    [buttonData]="button"
  >
    Test Button
  </button>`,
})
class TestComponent {
  button: Button = new SpecialButton(SpecialToken.ANS, 'value');
  dispatch(event: ButtonCustomEvent) {}
}

describe('CustomClickDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let directive: CustomClickDirective;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [CustomClickDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges();

    directive = fixture.debugElement
      .query(By.directive(CustomClickDirective))
      .injector.get(CustomClickDirective);

    component = fixture.componentInstance;
  });

  it('same button was passed', () => {
    expect(component.button).toEqual(directive.buttonData);
  });

  it('detect click event', async () => {
    const buttonEvent = new Event('click');
    spyOn(directive, 'onCustomClick').withArgs(buttonEvent);
    fixture.debugElement.nativeElement.querySelector('button').dispatchEvent(buttonEvent);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(directive.onCustomClick).toHaveBeenCalledWith(buttonEvent);
    });
  });
});
