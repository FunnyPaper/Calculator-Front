import { ButtonGroup } from '../enums/button-group.enum';

export default class TokenData {
  constructor(
    private readonly __value: string,
    private readonly __group: ButtonGroup
  ) {
    if (
      !Object.values(ButtonGroup).some(
        (k) => k == __group || ((k as ButtonGroup) & __group) > 0
      )
    ) {
      throw new Error('Invalid token group');
    }
  }
  get value(): string {
    return this.__value;
  }
  get group(): ButtonGroup {
    return this.__group;
  }
}
