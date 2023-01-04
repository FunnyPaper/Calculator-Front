import { BitwiseAndPipe } from './bitwise-and.pipe';

describe('BitwiseAndPipe', () => {
  let pipe: BitwiseAndPipe;

  beforeEach(() => {
    pipe = new BitwiseAndPipe();
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('perform bitwise or between specified numbers', () => {
    expect(pipe.transform(1, 2, 3)).toEqual(1 & 2 & 3);
  })
});
