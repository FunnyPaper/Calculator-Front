import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import ButtonCustomEvent from '../events/button-custom-event.event';
import { Button } from '../models/button.model';

@Directive({
  selector: 'button[custom-click][customClick][buttonData]'
})
export class CustomClickDirective {
  @Input()
  buttonData!: Button;

  @Output()
  customClick: EventEmitter<ButtonCustomEvent> = new EventEmitter();

  @HostListener('click', ['$event'])
  onCustomClick(event: Event) {
    this.customClick?.emit(new ButtonCustomEvent(event, this.buttonData));
  }
}
