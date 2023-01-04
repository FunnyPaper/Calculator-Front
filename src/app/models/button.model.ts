export interface IButton {
  get value(): string;
  set value(value: string);
}

export abstract class Button implements IButton {
  constructor(protected _value: string) {}
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
  }
}
