import { IKeyData } from "./key-data.interface";

export interface IButton {
  get key(): IKeyData | undefined;
  get value(): string;
  set value(value: string);
}
