import { Button } from "../models/button.model";

export default class ButtonCustomEvent {
  constructor(public event: Event, public buttonData: Button) {}
}
