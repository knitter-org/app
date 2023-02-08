import { rangeEndInclusive } from './range';

describe('rangeEndInclusive', () => {
  it('should return an array with the range number values and inclusive the end', () => {
    expect(rangeEndInclusive(0, 3)).toEqual([1, 2, 3]);
  });
  it('should return an array with the range number values and inclusive the end', () => {
    expect(rangeEndInclusive(4, 5)).toEqual([5]);
  });
  it('should return an empty array on equal numbers', () => {
    expect(rangeEndInclusive(3, 3)).toEqual([]);
  });
});
