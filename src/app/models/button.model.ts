import { IButton } from "../interfaces/button.interface";
import { IKeyData } from "../interfaces/key-data.interface";

const combination = {
  alt: false,
  ctrl: false,
  shift: false,
}

export abstract class Button implements IButton {
  private static readonly __buttonRegistry: Map<string, Button> = new Map();
  private static readonly __keysRegistry: Map<IKeyData, Button> = new Map();
  constructor(protected _value: string, protected _keyData?: IKeyData) {
    if (this._keyData) {
      this._keyData.combination = { ...combination, ...this._keyData.combination }
      Button.__keysRegistry.set(this._keyData, this);
    }
    Button.__buttonRegistry.set(this._value, this);
  }
  static getRegisteredButton(
    key?: string
  ): [string, Button][] | Button | undefined {
    if (key != null) {
      return Button.__buttonRegistry.get(key);
    }

    return [...Button.__buttonRegistry.entries()];
  }
  static setRegisteredButton(key: string, button: Button): void {
    Button.__buttonRegistry.set(key, button);
  }
  static getRegisteredKey(
    key?: IKeyData
  ): [IKeyData, Button][] | Button | undefined {
    if (key != null) {
      return [...Button.__keysRegistry.entries()].find(
        (p) => JSON.stringify(p[0]) === JSON.stringify(key)
      )?.[1];
    }

    return [...Button.__keysRegistry.entries()];
  }
  static setRegisteredKey(keyData: IKeyData, buttonData: Button): void {
    keyData.combination = { ...combination, ...keyData.combination }
    Button.__keysRegistry.set(keyData, buttonData);
  }
  get key(): IKeyData | undefined {
    return this._keyData;
  }
  get value(): string {
    return this._value;
  }
}
