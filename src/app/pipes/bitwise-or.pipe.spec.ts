import { BitwiseOrPipe } from './bitwise-or.pipe';

describe('BitwiseOrPipe', () => {
  let pipe: BitwiseOrPipe;

  beforeEach(() => {
    pipe = new BitwiseOrPipe();
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('perform bitwise or between specified numbers', () => {
    expect(pipe.transform(1, 2, 3)).toEqual(1 | 2 | 3);
  })
});
